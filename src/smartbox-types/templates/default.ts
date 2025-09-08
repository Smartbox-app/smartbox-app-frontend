import { TemplateType } from '.';

export const DEFAULT_TEMPLATES = {
  [TemplateType.INVITE_USER_EMAIL]: `Cześć!
    Oto Twoje zaproszenie do platformy {{company}}, już po zarejestrowaniu możesz sprawdzić naszą ofertę. Powodzenia!
`,
  [TemplateType.ACCOUNT_ACTIVATED_EMAIL]: `Cześć {{name}}!
Twoje konto zostało pomyślnie założone, teraz możesz wynająć odpowiedni domek na swoje rzeczy.`,
  [TemplateType.USER_BLOCKED_EMAIL]: `Twoje konto użytkownika zostało zablokowane. Prosimy o kontakt z biurem obsługi klienta pod adresem {{email}} lub tel: {{phone}} w celu wyjaśnienia zaistniałej sytuacji.`,
  [TemplateType.USER_UNBLOCKED_EMAIL]: `Zostałeś odblokowany, możesz kontynuować korzystanie z mini magazynów w {{company}}, zapraszamy.`,
  [TemplateType.RENTAL_EXTENDED_MAIL]: `Cześć {{name}}!
Przedłużyłeś wynajęcie skrytki numer {{number}} do {{rentUntil}} za {{cost}} zł.`,
  [TemplateType.RENTAL_PERIOD_PAID_MAIL]: `Cześć {{name}}!
Opłaciłeś ok {{periodFrom}} - {{periodTo}} res wynajęcia skrytki numer {{number}} za {{cost}} zł.`,
  [TemplateType.NEW_RENTAL_MAIL]: `Cześć {{name}}!
Udało się! Wynająłeś domek dla Twoich rzeczy. Masz box o numerze {{number}} od {{rentFrom}} do {{rentUntil}} za {{cost}} zł.`,
  [TemplateType.RENTAL_EXTENDED_ADMIN_NOTIFICATION_MAIL]: `Użytkownik {{email}} przedłużył wynajęcie skrytki numer {{number}} na placu {{stock}} do {{rentUntil}} za {{cost}} zł.`,
  [TemplateType.RENTAL_PERIOD_PAID_ADMIN_NOTIFICATION_MAIL]: `Użytkownik {{email}} opłacił okres {{periodFrom}} - {{periodTo}} wynajęcia skrytki numer {{number}} na placu {{stock}} do {{rentUntil}} za {{cost}} zł.`,
  [TemplateType.NEW_RENTAL_ADMIN_NOTIFICATION_MAIL]: `Użytkownik {{email}} wynajął skrytkę numer {{number}} na placu {{stock}} od {{rentFrom}} do {{rentUntil}} za {{cost}} zł.`,
  [TemplateType.NO_PAYMENT_EMAIL]: `Cześć {{name}}!
Nie odnotowaliśmy płatności za kontynuację wynajmu mini magazynu w {{company}}. Aby dokonać opłaty lub zakończyć wynajem zaloguj się do aplikacji, kliknij na swój magazyn i dokonaj wybranej czynności.
Brak płatności może spowodować zablokowanie dostępu do skrytki.`,
  [TemplateType.NO_PERIOD_PAYMENT_EMAIL]: `Cześć {{name}}!
Nie odnotowaliśmy płatności za okres wynajmu mini magazynu w {{company}}. Aby dokonać opłaty zaloguj się do aplikacji, kliknij na swój magazyn i dokonaj wybranej czynności.
Brak płatności może spowodować zablokowanie dostępu do skrytki.`,
  [TemplateType.BOX_CHANGED_EMAIL]: `Cześć {{name}}!
Administrator zamienił Ci schowek z numeru {{oldNumber}} na numer {{newNumber}}. Przenieś proszę swoje rzeczy.`,
  [TemplateType.AUTO_PAYMENT_FAILED_EMAIL]: `Cześć {{name}}!
Nie udało nam się pobrać środków na kontynuację wynajmu mini magazynu w {{company}}. Aby dokonać opłaty lub zakończyć wynajem, zaloguj się do aplikacji, kliknij na swój magazyn i dokonaj wybranej czynności.
Brak płatności może spowodować zablokowanie dostępu do skrytki.`,
  [TemplateType.EXTEND_RENTAL_EMAIL]: `Cześć {{name}}!
W dniu jutrzejszym (tj. {{rentUntil}}) kończy się wynajem Twojej skrytki nr {{number}}, nie żegnajmy się jeszcze, to świetna współpraca. Opłać ją aby Twoje rzeczy w {{company}} czuły się bezpiecznie.
Przypominamy, że w przypadku braku chęci przedłużenia najmu Użytkownik jest zobowiązany dokonać zwrotu schowka najpóźniej z chwilą upływu czasu najmu (tj. godz. 23.59 ostatniego dnia najmu), jest również zobowiązany zabrać wszystkie swoje ruchomości ze skrytki po zakończeniu najmu. W przypadku, gdy Użytkownik nie zabierze swoich ruchomości ze Schowka po zakończeniu Najmu, Operator wezwie Użytkownika do zabrania rzeczy, wyznaczając mu dodatkowy termin, który nie może wynosić mniej niż 1 (słownie: jeden) dni. Jeżeli Użytkownik nie zabierze swoich ruchomości w dodatkowym terminie, Operator jest uprawniony do opróżnienia Schowka we własnym zakresie oraz przekazania ruchomości na adres wskazany przez Użytkownika, na koszt i ryzyko Użytkownika lub utylizacji / usunięcia zawartości Schowka na koszt i ryzyko Użytkownika (wybór pomiędzy przekazaniem a utylizacją należy do Operatora).`,
  [TemplateType.RENTAL_ENDS_IN_3_DAYS_EMAIL]: `Cześć {{name}}!
W dniu {{rentUntil}} kończy się wynajem Twojej skrytki nr {{number}}, nie żegnajmy się jeszcze, to świetna współpraca. Opłać ją aby Twoje rzeczy w {{company}} czuły się bezpiecznie.
Przypominamy, że w przypadku braku chęci przedłużenia najmu Użytkownik jest zobowiązany dokonać zwrotu schowka najpóźniej z chwilą upływu czasu najmu (tj. godz. 23.59 ostatniego dnia najmu), jest również zobowiązany zabrać wszystkie swoje ruchomości ze skrytki po zakończeniu najmu. W przypadku, gdy Użytkownik nie zabierze swoich ruchomości ze Schowka po zakończeniu Najmu, Operator wezwie Użytkownika do zabrania rzeczy, wyznaczając mu dodatkowy termin, który nie może wynosić mniej niż 1 (słownie: jeden) dni. Jeżeli Użytkownik nie zabierze swoich ruchomości w dodatkowym terminie, Operator jest uprawniony do opróżnienia Schowka we własnym zakresie oraz przekazania ruchomości na adres wskazany przez Użytkownika, na koszt i ryzyko Użytkownika lub utylizacji / usunięcia zawartości Schowka na koszt i ryzyko Użytkownika (wybór pomiędzy przekazaniem a utylizacją należy do Operatora).`,
  [TemplateType.RENTAL_ENDS_TODAY_EMAIL]: `Cześć {{name}}!
Dzisiaj upływa termin wynajmu Twojej skrytki {{number}}. Aby dokonać opłaty lub zakończyć wynajem zaloguj się do aplikacji, kliknij na swój magazyn i dokonaj wybranej czynności. Brak dokonania czynności zablokuje Ci dostęp do skrytki zgodnie z obowiązującym regulaminem {{company}}.
Przypominamy, że w przypadku braku chęci przedłużenia najmu Użytkownik jest zobowiązany dokonać zwrotu schowka najpóźniej z chwilą upływu czasu najmu (tj. godz. 23.59 ostatniego dnia najmu), jest również zobowiązany zabrać wszystkie swoje ruchomości ze skrytki po zakończeniu najmu. W przypadku, gdy Użytkownik nie zabierze swoich ruchomości ze Schowka po zakończeniu Najmu, Operator wezwie Użytkownika do zabrania rzeczy, wyznaczając mu dodatkowy termin, który nie może wynosić mniej niż 1 (słownie: jeden) dni. Jeżeli Użytkownik nie zabierze swoich ruchomości w dodatkowym terminie, Operator jest uprawniony do opróżnienia Schowka we własnym zakresie oraz przekazania ruchomości na adres wskazany przez Użytkownika, na koszt i ryzyko Użytkownika lub utylizacji / usunięcia zawartości Schowka na koszt i ryzyko Użytkownika (wybór pomiędzy przekazaniem a utylizacją należy do Operatora).
      `,
  [TemplateType.PERIOD_PAYMENT_EMAIL]: `Cześć {{name}}!
Wystawiliśmy fakturę na kolejny okres Twojego wynajmu skrytki {{number}}, masz czas na zapłatę do {{paymentUntil}}. Zaloguj się do panelu i opłać dalszy wynajem.`,
  [TemplateType.USER_BLOCKED_SMS]: `Twoje konto użytkownika zostało zablokowane. Prosimy o kontakt z biurem obsługi klienta pod adresem {{email}} lub tel: {{phone}}`,
  [TemplateType.USER_UNBLOCKED_SMS]: `Twoje konto w {{company}} znow jest aktywne.`,
  [TemplateType.NEW_RENTAL_SMS]: `Czesc {{name}}! Udalo sie! Do dnia {{rentUntil}} wynajales domek dla Twoich rzeczy. Pamietaj o zabraniu ze soba klodki :)`,
  [TemplateType.RENTAL_EXTENDED_SMS]: `Dziekujemy za dokonanie platnosci. Twoje skarby sa u nas nadal bezpieczne. Cieszymy sie z dalszej, dobrej wspolpracy.`,
  [TemplateType.NO_PAYMENT_SMS]: `Nie odnotowalismy platnosci za kontynuacje wynajmu mini magazynu w {{company}}. Oplac prosze swoja skrytke w ciagu 1 dnia lub zakoncz wynajem.`,
  [TemplateType.NO_PERIOD_PAYMENT_SMS]: `Nie odnotowalismy platnosci za okres wynajmu mini magazynu w {{company}}. Oplac prosze swoja skrytke.`,
  [TemplateType.BOX_CHANGED_SMS]: `Witaj, administrator zamienił Ci schowek z numeru {{oldNumber}} na numer {{newNumber}}. Przenieś proszę swoje rzeczy.`,
  [TemplateType.AUTO_PAYMENT_FAILED_SMS]: `Nie udalo nam sie pobrac srodkow na kontynuacje wynajmu mini magazynu w {{company}}. Oplac swoja skrytke w ciagu 1 dnia lub zakoncz wynajem.`,
  [TemplateType.EXTEND_RENTAL_SMS]: `Czesc {{name}}! W dniu jutrzejszym konczy sie wynajem Twojej skrytki {{company}}. Zaloguj sie do aplikacji aby przedluzyc lub zakonczyc wynajem.`,
  [TemplateType.RENTAL_ENDS_TODAY_SMS]: `Dzis uplywa termin wynajmu Twojej skrytki {{company}}. Oplac swoj mini magazyn zeby uniknac blokady w systemie lub zakoncz wynajem.`,
  [TemplateType.RENTAL_ENDS_IN_3_DAYS_SMS]: `W dniu {{rentUntil}} konczy sie wynajem Twojej skrytki {{company}}.`,
  [TemplateType.PERIOD_PAYMENT_SMS]: `Czesc {{name}}! Wystawilismy fakture na kolejny okres Twojego wynajmu, czas na zaplate do {{paymentUntil}}.`,
  [TemplateType.RENTAL_PERIOD_PAID_SMS]: `Czesc {{name}}! Okres płatności za wynajem został opłacony.`,
};
