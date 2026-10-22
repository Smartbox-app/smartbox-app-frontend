import UIKit
import Capacitor
import FBSDKCoreKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        window = UIWindow(windowScene: windowScene)
        window?.rootViewController = CAPBridgeViewController()
        window?.makeKeyAndVisible()

        // ponytail: copies SceneDelegateProxy's cold-start deferral so a Facebook URL is not also sent to Capacitor.
        let urls = connectionOptions.urlContexts.filter { !facebookHandled($0) }
        NotificationCenter.default.post(name: .capacitorSceneWillConnect, object: scene)
        var token: NSObjectProtocol?
        token = NotificationCenter.default.addObserver(forName: .capacitorViewDidAppear, object: nil, queue: .main) { _ in
            if let token {
                NotificationCenter.default.removeObserver(token)
            }
            if !urls.isEmpty {
                SceneDelegateProxy.shared.scene(scene, openURLContexts: urls)
            }
            for activity in connectionOptions.userActivities {
                SceneDelegateProxy.shared.scene(scene, continue: activity)
            }
        }
    }

    func sceneDidBecomeActive(_ scene: UIScene) {
        UIApplication.shared.applicationIconBadgeNumber = 0
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        let urls = URLContexts.filter { !facebookHandled($0) }
        if !urls.isEmpty {
            SceneDelegateProxy.shared.scene(scene, openURLContexts: urls)
        }
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }

    private func facebookHandled(_ context: UIOpenURLContext) -> Bool {
        FBSDKCoreKit.ApplicationDelegate.shared.application(
            UIApplication.shared,
            open: context.url,
            sourceApplication: context.options.sourceApplication,
            annotation: context.options.annotation
        )
    }
}
