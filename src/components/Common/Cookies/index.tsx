import React, { useState } from 'react';
import './Cookies.scss';

const Cookies = () => {
  const areAccepted = () => {
    try {
      return JSON.parse(localStorage.getItem('cookies') || 'false');
    } catch (e) {
      return false;
    }
  };

  const [accepted, setAccepted] = useState<boolean>(areAccepted());

  const accept = () => {
    localStorage.setItem('cookies', JSON.stringify(true));
    setAccepted(true);
  };

  return (
    <div className={`cookies-information ${accepted ? 'hide-cookies-bar' : ''}`}>
      <p>
        W tej aplikacji używamy plików cookies w celu zapewnienia użytkownikom efektywnego korzystania ze strony, a
        także narzędzi analitycznych, promocyjnych i reklamowych w celu reklamy, badania rynku oraz badania preferencji
        użytkowników. Korzystając z Aplikacji SmartBox, możesz wyrazić zgodę na korzystanie z plików cookies oraz
        wymienionych narzędzi. Więcej informacji na temat plików cookies oraz stosowanych narzędzi znajdziesz w naszej{' '}
        <a target="_blank" href="/assets/20210422_Polityka_Prywatnosci_SmartBox.pdf">
          <u>Polityce&nbsp;prywatności</u>
        </a>
        .
      </p>
      <span className="exit" onClick={accept}>
        &times;
      </span>
    </div>
  );
};

export default Cookies;
