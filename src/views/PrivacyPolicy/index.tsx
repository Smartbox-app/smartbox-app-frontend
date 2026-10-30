import { generateHTML } from '@tiptap/core';
import React from 'react';
import styled from 'styled-components';

import { Spinner } from 'src/components/Branded';
import { getDocumentEditorExtensions } from 'src/config/tiptap';
import { __ } from 'src/helpers/i18n';
import { useTenant } from 'src/hooks/useTenant';
import { useGetDocumentByTypeQuery } from 'src/queries';
import ApiService from 'src/services/api-service';
import { dateOnly } from 'src/utils/format-date';

const Page = styled.main`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  line-height: 1.65;
  font-size: 14px;

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 16px 0;
  }
  th,
  td {
    border: 1px solid #000;
    padding: 8px;
    vertical-align: top;
  }
  th {
    background: #f2f2f2;
  }
  ul {
    list-style-type: disc;
    padding: 20px;
  }
`;

const Section = styled.section`
  margin-top: 40px;
`;

const H1 = styled.h1`
  font-size: 32px;
  margin-bottom: 16px;
`;

const H2 = styled.h2`
  font-size: 22px;
  margin: 24px 0 12px;
`;

const P = styled.p`
  margin: 8px 0;
`;

export const PrivacyPolicy = () => {
  const { tenant } = useTenant();
  const { data: policy, isLoading } =
    useGetDocumentByTypeQuery('privacy-policy');

  if (!tenant || isLoading) return <Spinner />;

  if (policy) {
    const html = generateHTML(
      policy.content,
      getDocumentEditorExtensions(false),
    );
    return (
      <Page>
        <header>
          <H1>{__('application.privacyPolicy')}</H1>
        </header>
        <strong>
          {__('application.tables.lastUpdate')}: {dateOnly(policy.updatedAt)}
        </strong>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Page>
    );
  }

  if (!['aplikacja'].includes(tenant.identifier)) {
    if (tenant.privacy) {
      window.location.href = `${ApiService.url}tenant/privacy/${tenant.id}`;
    } else {
      return null;
    }
  }

  return (
    <Page>
      <header>
        <H1>POLITYKA PRYWATNOŚCI</H1>
      </header>

      <Section>
        <H2>Skrót najważniejszych informacji dotyczących Twojej prywatności</H2>
        <P>
          Administratorem Twoich danych osobowych jest SMARTBOX STORAGE
          DROBNIKOWSKI SPÓŁKA JAWNA z siedzibą w miejsc. BIADASZKI nr 14, kod
          63-430, poczta ODOLANÓW, wpisaną do Krajowego Rejestru Sądowego
          Gospodarczy KRS pod numerem 0000967062, posługującą się numerami NIP
          6222841335 oraz REGON 521778897.
        </P>
        <P>
          Kontakt z Administratorem jest możliwy pod adresem adres e-mail:
          kontakt@smartbox-storage.pl.
        </P>
        <P>
          Administrator przetwarza Twoje dane osobowe do celów związanych ze
          świadczeniem usług internetowych w ramach Aplikacji, w tym
          udostępniania Aplikacji do korzystania, a także do celów
          marketingowych. Szczegółowy opis poszczególnych celów wraz z
          podstawami prawnymi znajdziesz w tabelce poniżej.
        </P>
        <P>
          W ramach Aplikacji korzystamy z rozmaitych narzędzi, w tym
          wykorzystujących dane pochodzące z cookies. Przede wszystkim chodzi o
          narzędzia analityczne, marketingowe, remarketingowe, a także wtyczki,
          które umożliwiają korzystanie z zewnętrznych narzędzi. Szczegółowy
          opis wykorzystywanych przez nas narzędzi znajdziesz poniżej, w
          punktach dotyczących cookies oraz marketingu i reklamy.
        </P>
        <P>
          Twoje dane osobowe nie będą przetwarzane dłużej niż to wynika z
          obowiązujących przepisów prawa.
        </P>
        <P>
          Przysługuje Ci prawo do dostępu do swoich danych osobowych,
          sprostowania danych osobowych; usunięcia danych osobowych;
          ograniczenia przetwarzania danych osobowych; sprzeciwu wobec
          przetwarzania danych osobowych; przenoszenia danych osobowych.
        </P>
        <P>
          Jeżeli uważasz, że Twoje dane osobowe są przetwarzane niezgodnie z
          obowiązującymi przepisami prawa, możesz złożyć skargę do Prezesa
          Urzędu Ochrony Danych Osobowych.
        </P>
        <P>
          Jeżeli masz jakieś wątpliwości dotyczące przetwarzania danych
          osobowych, a przedstawione poniżej informacje okażą się
          niewystarczające, zachęcamy do kontaktu z nami pod adresem e-mail
          kontakt@smartbox-storage.pl.
        </P>
      </Section>
      <Section>
        <H2>Dane Administratora Danych Osobowych</H2>
        <P>
          Uprzejmie informujemy, że administratorem Twoich danych osobowych
          jest:
        </P>
        <P>
          1) SMARTBOX STORAGE DROBNIKOWSKI SPÓŁKA JAWNA z siedzibą w miejsc.
          BIADASZKI nr 14, kod 63-430, poczta ODOLANÓW, wpisaną do Krajowego
          Rejestru Sądowego Gospodarczy KRS pod numerem 0000967062, posługującą
          się numerami NIP 6222841335 oraz REGON 521778897, zwana dalej
          „Administratorem”.
        </P>
        <P>
          Kontakt z Administratorem jest możliwy pod adresem adres e-mail:
          kontakt@smartbox-storage.pl.
        </P>
        <P>
          Administrator udostępnia aplikację pod nazwą „SmartBox”, zwaną dalej:
          „Aplikacją”, i świadczy usługi elektroniczne związane z Aplikacją.
        </P>
      </Section>

      <Section>
        <H2>
          Cele i podstawy przetwarzania danych osobowych Użytkowników
          korzystających z Aplikacji
        </H2>
        <table>
          <thead>
            <tr>
              <th>Cel przetwarzania</th>
              <th>Zakres danych</th>
              <th>Podstawa prawna</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rejestracja Użytkownika</td>
              <td>
                imię i nazwisko;
                <br />
                adres e-mail;
                <br />
                numer telefonu;
                <br />
                data rejestracji
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest art. 6 ust. 1
                lit. b RODO, który pozwala przetwarzać dane osobowe, jeżeli są
                one konieczne do wykonania umowy lub podjęcia czynności
                zmierzających do zawarcia umowy.
              </td>
            </tr>
            <tr>
              <td>Wykonanie usług związanych z korzystaniem z Aplikacji</td>
              <td>
                imię i nazwisko;
                <br />
                adres e-mail;
                <br />
                numer telefonu
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest art. 6 ust. 1
                lit. b RODO, który pozwala przetwarzać dane osobowe, jeżeli są
                one konieczne do wykonania umowy lub podjęcia czynności
                zmierzających do zawarcia umowy.
              </td>
            </tr>
            <tr>
              <td>Wykonanie umowy najmu schowków</td>
              <td>
                imię i nazwisko;
                <br />
                adres e-mail;
                <br />
                numer telefonu;
                <br />
                adres zamieszkania;
                <br />
                informacje dot. złożenia dyspozycji najmu;
                <br />
                okres najmu;
                <br />
                lokalizacja schowka;
                <br />
                wysokość opłaty czynszowej;
                <br />
                informacja o sposobie płatności
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest art. 6 ust. 1
                lit. b RODO, który pozwala przetwarzać dane osobowe, jeżeli są
                one konieczne do wykonania umowy lub podjęcia czynności
                zmierzających do zawarcia umowy.
              </td>
            </tr>
            <tr>
              <td>Rozpatrzenie reklamacji i odstąpień od umowy</td>
              <td>
                imię i nazwisko;
                <br />
                adres e-mail;
                <br />
                numer telefonu;
                <br />
                informacje dot. złożenia dyspozycji najmu;
                <br />
                okres najmu;
                <br />
                lokalizacja schowka;
                <br />
                wysokość opłaty czynszowej;
                <br />
                informacja o sposobie płatności
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest po pierwsze,
                art. 6 ust. 1 lit. b RODO, który pozwala przetwarzać dane
                osobowe, jeżeli są one konieczne do wykonania umowy lub podjęcia
                czynności zmierzających do zawarcia umowy, po drugie, art. 6
                ust. 1 lit. c RODO, który pozwala przetwarzać dane osobowe,
                jeżeli takie przetwarzanie jest konieczne do wywiązania się
                przez Administratora Danych Osobowych z obowiązków wynikających
                z prawa.
              </td>
            </tr>
            <tr>
              <td>
                Wystawienie faktury i spełnienie innych obowiązków podatkowych
              </td>
              <td>
                imię i nazwisko;
                <br />
                firma;
                <br />
                adres prowadzenia działalności;
                <br />
                PKD;
                <br />
                NIP;
                <br />
                REGON;
                <br />
                adres e-mail;
                <br />
                numer telefonu;
                <br />
                informacje dot. złożenia dyspozycji najmu;
                <br />
                okres najmu;
                <br />
                lokalizacja schowka;
                <br />
                wysokość opłaty czynszowej;
                <br />
                informacja o sposobie płatności
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest art. 6 ust. 1
                lit. c RODO, który pozwala przetwarzać dane osobowe, jeżeli
                takie przetwarzanie jest konieczne do wywiązania się przez
                Administratora Danych Osobowych z obowiązków wynikających z
                prawa
              </td>
            </tr>
            <tr>
              <td>Komunikacja z Administratorem i pomiędzy Użytkownikami</td>
              <td>
                imię i nazwisko;
                <br />
                adres e-mail;
                <br />
                numer telefonu;
                <br />
                dane o usłudze lub sprawie, której dotyczy kontakt;
                <br />
                historia kontaktów z Administratorem;
                <br />
                historia kontaktów pomiędzy Użytkownikami.
              </td>
              <td>
                Podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. f
                RODO, który pozwala nam na realizację naszego uzasadnionego
                interesu, jaki w tym wypadku stanowi zapewnienie sprawnej i
                efektywnej komunikacji między Administratorem Danych Osobowych a
                Użytkownikami.
              </td>
            </tr>
            <tr>
              <td>Przesyłanie powiadomień e-mail</td>
              <td>
                imię i nazwisko;
                <br />
                adres e-mail.
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest art. 6 ust. 1
                lit. f RODO, który pozwala przetwarzać dane osobowe, jeżeli tym
                sposobem Administrator Danych Osobowych realizuje swój prawnie
                uzasadniony interes (w tym przypadku interesem Administratora
                jest informowanie Użytkownika o czynnościach związanych z
                korzystaniem z Aplikacji, podtrzymywanie relacji z Użytkownikiem
                oraz przekazywanie ważnych informacji na temat Aplikacji).
              </td>
            </tr>
            <tr>
              <td>Wypełnienie obowiązków z zakresu ochrony danych osobowych</td>
              <td>
                imię i nazwisko;
                <br />
                firma;
                <br />
                adres prowadzenia działalności;
                <br />
                PKD;
                <br />
                NIP;
                <br />
                REGON;
                <br />
                adres e-mail;
                <br />
                numer telefonu;
                <br />
                informacje dot. złożenia dyspozycji najmu;
                <br />
                okres najmu;
                <br />
                lokalizacja schowka;
                <br />
                wysokość opłaty czynszowej;
                <br />
                informacja o sposobie płatności
                <br />
                adres IP;
                <br />
                data rejestracji;
                <br />
                historia kontaktów z Administratorem;
                <br />
                historia korzystania z Aplikacji i Usług;
                <br />
                historia kontaktów pomiędzy Użytkownikami.
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest po pierwsze,
                art. 6 ust. 1 lit. c RODO, który pozwala przetwarzać dane
                osobowe, jeżeli takie przetwarzanie jest konieczne do wywiązania
                się przez Administratora Danych Osobowych z obowiązków
                wynikających z prawa; po drugie, art. 6 ust. 1 lit. f RODO,
                który pozwala przetwarzać dane osobowe, jeżeli tym sposobem
                Administrator Danych Osobowych realizuje swój prawnie
                uzasadniony interes (w tym przypadku interesem Administratora
                jest posiadanie wiedzy na temat osób, które np. realizują swoje
                uprawnienia wynikające z RODO)
              </td>
            </tr>
            <tr>
              <td>Ustalenie, dochodzenie lub obrona przed roszczeniami</td>
              <td>
                imię i nazwisko;
                <br />
                firma;
                <br />
                adres prowadzenia działalności;
                <br />
                PKD;
                <br />
                NIP;
                <br />
                REGON;
                <br />
                adres e-mail;
                <br />
                numer telefonu;
                <br />
                informacje dot. złożenia dyspozycji najmu;
                <br />
                okres najmu;
                <br />
                lokalizacja schowka;
                <br />
                wysokość opłaty czynszowej;
                <br />
                informacja o sposobie płatności
                <br />
                adres IP;
                <br />
                data i godzina rejestracji;
                <br />
                historia kontaktów z Administratorem;
                <br />
                historia korzystania z Aplikacji i Usług;
                <br />
                historia kontaktów pomiędzy Użytkownikami.
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest art. 6 ust. 1
                lit. f RODO, który pozwala przetwarzać dane osobowe, jeżeli tym
                sposobem Administrator Danych Osobowych realizuje swój prawnie
                uzasadniony interes (w tym przypadku interesem Administratora
                jest posiadanie danych osobowych, które pozwolą ustalić,
                dochodzić lub bronić się przed roszczeniami Użytkowników i osób
                trzecich).
              </td>
            </tr>
            <tr>
              <td>
                Zapewnienie bezpieczeństwa i przeciwdziałanie zachowaniom
                niezgodnym z regulaminem Aplikacji
              </td>
              <td>
                imię i nazwisko;
                <br />
                adres e-mail;
                <br />
                numer telefonu;
                <br />
                adres IP;
                <br />
                data i godzina rejestracji;
                <br />
                historia kontaktów z Administratorem;
                <br />
                historia korzystania z Aplikacji i Usług;
                <br />
                historia kontaktów pomiędzy Użytkownikami.
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest po pierwsze,
                art. 6 ust. 1 lit. b RODO, który pozwala przetwarzać dane
                osobowe, jeżeli są one konieczne do wykonania umowy lub podjęcia
                czynności zmierzających do zawarcia umowy, po drugie, art. 6
                ust. 1 lit. f RODO, który pozwala przetwarzać dane osobowe,
                jeżeli tym sposobem Administrator Danych Osobowych realizuje
                swój prawnie uzasadniony interes (w tym przypadku interesem
                Administratora jest zwalczanie działań, które mogłyby obniżyć
                komfort korzystania z Aplikacji lub narazić Administratora albo
                innych Użytkowników na szkodę).
              </td>
            </tr>
            <tr>
              <td>Cel archiwalny i dowodowy</td>
              <td>
                imię i nazwisko;
                <br />
                firma;
                <br />
                adres prowadzenia działalności;
                <br />
                PKD;
                <br />
                NIP;
                <br />
                REGON;
                <br />
                adres e-mail;
                <br />
                numer telefonu;
                <br />
                informacje dot. złożenia dyspozycji najmu;
                <br />
                okres najmu;
                <br />
                lokalizacja schowka;
                <br />
                wysokość opłaty czynszowej;
                <br />
                informacja o sposobie płatności
                <br />
                adres IP;
                <br />
                data i godzina rejestracji;
                <br />
                historia kontaktów z Administratorem;
                <br />
                historia korzystania z Aplikacji i Usług;
                <br />
                historia kontaktów pomiędzy Użytkownikami.
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest art. 6 ust. 1
                lit. f RODO, który pozwala przetwarzać dane osobowe, jeżeli tym
                sposobem Administrator Danych Osobowych realizuje swój prawnie
                uzasadniony interes (w tym przypadku interesem Administratora
                jest posiadanie danych osobowych, które pozwolą dowieść pewnych
                faktów związanych z korzystaniem przez Ciebie z Aplikacji,
                schowków i usług).
              </td>
            </tr>
            <tr>
              <td>Wykorzystanie cookies</td>
              <td>informacje gromadzone za pomocą plików cookies</td>
              <td>
                Podstawą prawną takiego przetwarzania jest art. 6 ust. 1 lit. a
                RODO, który pozwala przetwarzać dane osobowe na podstawie
                dobrowolnie udzielonej zgody (przy pierwszym wejściu na stronę
                Aplikacji pojawia się zapytanie o zgodę na wykorzystanie
                cookies).
              </td>
            </tr>
            <tr>
              <td>Cel analityczny</td>
              <td>
                data i godzina odwiedzin Aplikacji;
                <br />
                rodzaj systemu operacyjnego;
                <br />
                adres IP;
                <br />
                dane lokalizacyjne;
                <br />
                rodzaj przeglądarki internetowej wykorzystywanej do korzystania
                z Aplikacji;
                <br />
                czas spędzony na stronie Aplikacji;
                <br />
                odwiedzone podstrony, ścieżki nawigacji w witrynie i źródła
                odesłań.
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest art. 6 ust. 1
                lit. f RODO, który pozwala przetwarzać dane osobowe, jeżeli tym
                sposobem Administrator Danych Osobowych realizuje swój prawnie
                uzasadniony interes (w tym przypadku interesem Administratora
                jest poznanie aktywności Użytkowników w ramach Aplikacji, np. na
                potrzeby optymalizacji Aplikacji, przyspieszenia jej działania
                etc.).
              </td>
            </tr>
            <tr>
              <td>Cele marketingowe</td>
              <td>
                imię i nazwisko;
                <br />
                adres e-mail;
              </td>
              <td>
                Podstawą prawną takiego przetwarzania danych jest art. 6 ust. 1
                lit. f RODO, który pozwala przetwarzać dane osobowe, jeżeli tym
                sposobem Administrator realizuje swój prawnie uzasadniony
                interes (w tym przypadku interesem Administratora jest
                pozyskiwanie nowych klientów oraz zwiększanie sprzedaży swoich
                usług).
              </td>
            </tr>
          </tbody>
        </table>
      </Section>
      <Section>
        <H2>Pliki cookies</H2>
        <P>
          Administrator w ramach Aplikacji, podobnie jak inne podmioty,
          wykorzystuje tzw. cookies, czyli krótkie informacje tekstowe
          zapisywane na komputerze, telefonie, tablecie lub innym urządzeniu, z
          którego korzystasz. Mogą być one odczytywane przez system
          Administratora, a także przez systemy należące do innych podmiotów, z
          których usług korzystamy (np. Google’a, Facebooka).
        </P>
        <P>
          Cookies spełniają bardzo wiele funkcji w ramach Aplikacji, najczęściej
          przydatnych, które postaramy się opisać poniżej (jeżeli informacje są
          niewystarczające, prosimy o kontakt):
        </P>
        <ul>
          <li>
            zapewnianie bezpieczeństwa — służą do ochrony danych osobowych
            Użytkownika przed dostępem osób nieupoważnionych;
          </li>
          <li>
            wpływ na procesy i wydajność korzystania z Aplikacji — pliki cookies
            są wykorzystywane do tego, aby Aplikacja sprawnie działała i aby
            można było korzystać z funkcji w niej dostępnych, co jest możliwe
            między innymi dzięki zapamiętywaniu ustawień pomiędzy kolejnymi
            odwiedzinami w ramach Aplikacji. Dzięki nim można zatem sprawnie
            poruszać się w ramach Aplikacji i poszczególnych podstronach.
          </li>
          <li>
            stan sesji — w plikach cookies zapisywane są informacje o tym, jak
            odwiedzający korzystają z Aplikacji, np. które podstrony najczęściej
            wyświetlają. Umożliwiają również identyfikację błędów wyświetlanych
            na niektórych podstronach. Pliki cookies służące do zapisywania tzw.
            „stanu sesji” pomagają zatem ulepszać usługi i zwiększać komfort
            korzystania z Aplikacji;
          </li>
          <li>
            tworzenie statystyk — pliki cookies są wykorzystywane do tego, aby
            przeanalizować, w jaki sposób Użytkownicy korzystają z Aplikacji
            (jak wielu otwiera Aplikację, jak długo w niej pozostają, które
            treści wzbudzają największe zainteresowanie etc.). Dzięki temu można
            stale ją ulepszać i dostosowywać działanie do preferencji
            użytkowników. W celu śledzenia aktywności i tworzenia statystyk
            wykorzystujemy rozmaite narzędzia, o czym mowa jest szerzej w pkt V.
          </li>
        </ul>
        <P>
          Twoja przeglądarka internetowa domyślnie dopuszcza wykorzystywanie
          cookies w Twoim urządzeniu, dlatego przy pierwszej wizycie prosimy o
          wyrażenie zgody na użycie cookies. Jeżeli jednak nie życzysz sobie
          wykorzystania cookies przy korzystaniu z Aplikacji, można zmienić
          ustawienia w przeglądarce internetowej — całkowicie blokować
          automatyczną obsługę plików cookies lub żądać powiadomienia o
          każdorazowym zamieszczeniu cookies w urządzeniu. Ustawienia można
          zmienić w dowolnej chwili.
        </P>
        <P>
          Szanując autonomię wszystkich osób korzystających z Aplikacji, czujemy
          się jednak w obowiązku uprzedzić, że wyłączenie lub ograniczenie
          obsługi plików cookies może spowodować dość poważne trudności w
          korzystaniu z Aplikacji, np. w postaci dłuższego okresu ładowania się
          Aplikacji, ograniczeń w korzystaniu z funkcjonalności etc.
        </P>
      </Section>
      <Section>
        <H2>Badanie aktywności Użytkowników w ramach Aplikacji</H2>
        <P>
          Administrator, w celach analitycznych, a także polepszania jakości
          świadczonych usług, używa narzędzi informatycznych, które są
          dostarczane przez zewnętrznych dostawców, w związku z czym
          wykorzystuje następujące narzędzia:
        </P>
        <P>
          Google Analytics — w celu zbierania danych o Użytkownikach
          odwiedzających Aplikację.
        </P>
        <P>
          Korzystanie z powyższych narzędzi odbywa się za Twoją zgodą, wyrażaną
          przy pierwszym wejściu na stronę Aplikacji.
        </P>
        <P>
          Jeżeli uważasz, że nie powinniśmy przetwarzać Twoich danych osobowych
          za pomocą wymienionych narzędzi, w każdej chwili możesz cofnąć
          wyrażoną zgodę oraz zablokować gromadzenie danych na ich potrzeby.
        </P>
        <P>
          Aby zablokować działanie Google Analytics, należy pobrać i
          zainstalować odpowiedni dodatek do przeglądarki, który jest dostępny
          pod następującym adresem:
          https://tools.google.com/dlpage/gaoptout?hl=pl&fbclid=IwAR3H667DTSlA7u-3Q7M4oVGr2aXiecyE6lE9bCdTJEKJv1-sByqjuU5c6aU.
        </P>
        <P>
          Oczywiście, w każdej chwili możesz ponownie wyrazić zgodę i przywrócić
          działanie wskazanych narzędzi.
        </P>
      </Section>
      <Section>
        <H2>Prawo wycofania zgody</H2>
        <P>
          Jeżeli przetwarzanie danych osobowych odbywa się na podstawie zgody, w
          każdej chwili możesz tę zgodę cofnąć — wedle własnego uznania.
        </P>
        <P>
          Jeżeli chciałbyś/chciałabyś cofnąć zgodę na przetwarzanie danych
          osobowych, to w tym celu wystarczy wysłać maila bezpośrednio na adres
          Administratora — kontakt@smartbox-storage.pl. W przypadku danych
          lokalizacyjnych cofnięcie zgody następuje poprzez zmianę preferencji w
          urządzeniu, którego używasz (np. za pośrednictwem przeglądarki).
        </P>
        <P>
          Jeżeli przetwarzanie Twoich danych osobowych odbywało się na podstawie
          zgody, jej cofnięcie nie powoduje, że przetwarzanie danych osobowych
          do tego momentu było nielegalne. Innymi słowy, do czasu cofnięcia
          zgody mamy prawo przetwarzać Twoje dane osobowe i jej odwołanie nie
          wpływa na zgodność z prawem dotychczasowego przetwarzania.
        </P>
      </Section>
      <Section>
        <H2>Wymóg podania danych osobowych</H2>
        <P>
          Podanie danych osobowych jest dobrowolne i zależy od Twojej decyzji.
          Jednakże podanie określonych danych osobowych jest konieczne, aby
          spełnić Twoje oczekiwania w zakresie korzystania z Aplikacji.
        </P>
        <P>
          Jeżeli kontaktujesz się z nami w jakiejkolwiek sprawie związanej z
          Aplikacją, schowkami lub usługami, które świadczymy, podanie Twoich
          danych kontaktowych może być konieczne do udzielenia Ci odpowiedzi na
          zadane pytanie.
        </P>
        <P>
          Jeżeli chcesz założyć konto użytkownika w Aplikacji, podanie takich
          danych, jak imię i nazwisko, adres e-mail, numer telefonu jest
          niezbędne do założenia konta użytkownika — bez tych danych korzystanie
          z konta użytkownika nie będzie możliwe.
        </P>
        <P>
          Jeżeli chcesz skorzystać z najmu schowka, podanie takich danych, jak
          imię i nazwisko, adres e-mail, numer telefonu, adres zamieszkania jest
          niezbędne do rozpoczęcia korzystania ze schowka — bez tych danych
          korzystanie ze schowka nie będzie możliwe.
        </P>
        <P>
          Jeżeli wymóg podania Twoich danych wynika z przepisów prawa, np. na
          potrzeby wystawienia faktury — podanie danych jest Twoim obowiązkiem.
        </P>
      </Section>
      <Section>
        <H2>Zautomatyzowane podejmowanie decyzji i profilowanie</H2>
        <P>
          Twoje dane nie są przez nas wykorzystywane do zautomatyzowanego
          podejmowania decyzji, które mogłyby mieć wpływ na Twoją sytuację
          prawną lub wywoływać w stosunku do Ciebie inne podobnie doniosłe
          skutki.
        </P>
      </Section>
      <Section>
        <H2>Odbiorcy danych osobowych</H2>
        <P>
          Jak większość przedsiębiorców, w swojej działalności korzystamy z
          pomocy innych podmiotów, co niejednokrotnie wiąże się z koniecznością
          przekazania danych osobowych. W związku z powyższym, w razie potrzeby,
          możemy przekazać Twoje dane naszym podwykonawcom, firmie hostingowej,
          firmie zajmującej się mailingiem, prawnikom, właścicielom mediów
          społecznościowych, dostawcom usług IT oraz oprogramowania oraz innym
          podmiotom, których towary lub usługi są nam niezbędne do
          funkcjonowania Aplikacji oraz prowadzenia działalności za jej
          pośrednictwem.
        </P>
        <P>
          Oprócz tego może się zdarzyć, że np. na podstawie właściwego przepisu
          prawa lub decyzji właściwego organu będziemy musieli przekazać Twoje
          dane osobowe również innym podmiotom, czy to publicznym czy prywatnym.
          Dlatego niezmiernie trudno nam przewidzieć, kto może zgłosić się z
          żądaniem udostępnienia danych osobowych. Niemniej ze swojej strony
          zapewniamy, że każdy przypadek żądania udostępnienia danych osobowych
          analizujemy bardzo starannie i bardzo wnikliwie, aby niechcący nie
          przekazać informacji osobie nieuprawnionej.
        </P>
      </Section>
      <Section>
        <H2>Przekazywanie danych osobowych do państw trzecich</H2>
        <P>
          Jak większość przedsiębiorców, korzystamy z różnych popularnych usług
          i technologii, oferowanych przez takie podmioty, jak Microsoft,
          Facebook czy Google. Firmy te mają siedziby poza Unią Europejską, a
          zatem w świetle przepisów RODO są traktowane jako państwa trzecie.
        </P>
        <P>
          RODO wprowadza pewne ograniczenia w przekazywaniu danych osobowych do
          państw trzecich, ponieważ skoro co do zasady nie stosuje się tam
          przepisów europejskich, ochrona danych osobowych obywateli Unii
          Europejskiej może okazać się niewystarczająca. Dlatego też każdy
          administrator danych osobowych ma obowiązek ustalić podstawę prawną
          takiego przekazywania.
        </P>
        <P>
          Ze swojej strony zapewniamy, że przy korzystaniu z usług i technologii
          przekazujemy dane osobowe wyłącznie podmiotom ze Stanów Zjednoczonych
          i wyłącznie takim, które spełniają wymogi RODO w zakresie
          przekazywania danych do państwa trzeciego. Przekazywanie danych
          osobowych odbywa się na podstawie standardowych klauzul umownych,
          które zostały przyjęte przez Komisję Europejską i są wykorzystywane w
          działalności wymienionych podmiotów.
        </P>
        <P>
          W każdej chwili udzielimy Ci dodatkowych wyjaśnień odnośnie
          przekazywania danych osobowych, w szczególności, gdy kwestia ta budzi
          Twój niepokój.
        </P>
      </Section>
      <Section>
        <H2>Okres przetwarzania danych</H2>
        <P>
          Zgodnie z obowiązującymi przepisami prawa nie przetwarzamy Twoich
          danych osobowych „w nieskończoność”, lecz przez czas, który jest
          potrzebny, aby osiągnąć wyznaczony cel. Po tym okresie Twoje dane
          osobowe zostaną nieodwracalnie usunięte lub zniszczone.
        </P>
        <P>
          Odnośnie poszczególnych okresów przetwarzania danych osobowych,
          uprzejmie informujemy, że dane osobowe przetwarzamy:
        </P>
        <ul>
          <li>
            przez okres korzystania z Aplikacji — w odniesieniu do danych
            osobowych przetwarzanych w celu skorzystania z funkcjonalności
            Aplikacji;
          </li>
          <li>
            przez okres najmu schowka — w odniesieniu do danych osobowych
            przetwarzanych w celu najmu schowka za pomocą Aplikacji;
          </li>
          <li>
            do czasu przedawnienia roszczeń — w odniesieniu do danych osobowych
            przetwarzanych w celu ustalenia, dochodzenia lub obrony roszczeń.
            Długość okresu przedawnienia zależy od tego, czy obie strony są
            przedsiębiorcami czy nie;
          </li>
          <li>
            do czasu skutecznego cofnięcia zgody — w odniesieniu do danych
            osobowych przetwarzanych na podstawie Twojej zgody;
          </li>
          <li>
            do czasu skutecznego wniesienia sprzeciwu lub osiągnięcia celu
            przetwarzania — w odniesieniu do danych osobowych przetwarzanych na
            podstawie prawnie uzasadnionego interesu Administratora Danych
            Osobowych;
          </li>
          <li>
            do czasu zdezaktualizowania się lub utraty przydatności — w
            odniesieniu do danych osobowych przetwarzanych głównie do celów
            administrowania Aplikacją.
          </li>
        </ul>
        <P>
          Okresy w latach liczymy od końca roku, w którym rozpoczęliśmy
          przetwarzanie danych osobowych, aby usprawnić proces usuwania lub
          niszczenia danych osobowych. Odrębne liczenie terminu dla każdej
          usługi wiązałoby się z istotnymi trudnościami organizacyjnymi i
          technicznymi, jak również znaczącym nakładem finansowym, dlatego
          ustanowienie jednej daty usuwania lub niszczenia danych osobowych
          pozwala nam sprawniej zarządzać tych procesem.
        </P>
        <P>
          Oczywiście, w przypadku np. skorzystania przez Ciebie z prawa do
          zapomnienia, wydania określonej decyzji administracyjnej czy wymogu
          wynikającego wprost z przepisu prawa usunięcie danych osobowych może
          nastąpić w szybszym terminie niż wynikający z ust. 2-3. Każda taka
          sytuacja jest rozpatrywana indywidualnie przez Administratora Danych
          Osobowych.
        </P>
        <P>
          Dodatkowy rok związany z przetwarzaniem danych osobowych zebranych na
          potrzeby wykonania umowy jest podyktowany tym, że hipotetycznie możesz
          zgłosić roszczenie na chwilę przed upływem terminu przedawnienia,
          żądanie może zostać doręczone z istotnym opóźnieniem lub możesz
          błędnie określić termin przedawnienia swojego roszczenia.
        </P>
      </Section>
      <Section>
        <H2>Uprawnienia podmiotów danych</H2>
        <P>Uprzejmie informujemy, że przysługuje Ci prawo do:</P>
        <ul>
          <li>dostępu do swoich danych osobowych;</li>
          <li>sprostowania danych osobowych;</li>
          <li>usunięcia danych osobowych;</li>
          <li>ograniczenia przetwarzania danych osobowych;</li>
          <li>sprzeciwu wobec przetwarzania danych osobowych;</li>
          <li>przenoszenia danych osobowych.</li>
        </ul>
        <P>
          Szanujemy Twoje prawa wynikające z przepisów o ochronie danych
          osobowych i staramy się ułatwiać ich realizację w najwyższym możliwym
          stopniu.
        </P>
        <P>
          Wskazujemy, że wymienione uprawnienia nie mają charakteru absolutnego,
          a zatem w niektórych sytuacjach możemy zgodnie z prawem odmówić Ci ich
          spełnienia. Jednakże, jeżeli odmawiamy uwzględnienia żądania, to tylko
          po wnikliwej analizie i tylko w sytuacji, gdy odmowa uwzględnienia
          żądania jest konieczna.
        </P>
        <P>
          Odnośnie prawa do wniesienia sprzeciwu wyjaśniamy, że w każdej chwili
          przysługuje Ci prawo do sprzeciwienia się przetwarzaniu danych
          osobowych na podstawie prawnie uzasadnionego interesu Administratora
          Danych Osobowych w związku z Twoją szczególną sytuacją. Musisz jednak
          pamiętać, że zgodnie z przepisami możemy odmówić uwzględnienia
          sprzeciwu, jeżeli wykażemy, że:
        </P>
        <ul>
          <li>
            istnieją prawnie uzasadnione podstawy do przetwarzania, które są
            nadrzędne w stosunku do Twoich interesów, praw i wolności lub
          </li>
          <li>
            istnieją podstawy do ustalenia, dochodzenia lub obrony roszczeń.
          </li>
        </ul>
        <P>
          Zaprzestanie korzystania z Aplikacji, cofnięcie zgody, zgłoszenie
          sprzeciwu czy żądania natychmiastowego usunięcia danych osobowych nie
          powoduje automatycznie, że od tej chwili przestaniemy przetwarzać
          wszystkie Twoje dane osobowe, we wszystkich celach, do jakich je
          zbieraliśmy. Może się bowiem okazać, że o ile zaprzestaniemy
          przetwarzać Twoje dane osobowe w jednym celu, możemy kontynuować ich
          przetwarzanie w pozostałych celach, jakie przedstawiliśmy Ci w pkt II.
        </P>
      </Section>
      <Section>
        <H2>Prawo do wniesienia skargi</H2>
        <P>
          Jeżeli uważasz, że Twoje dane osobowe są przetwarzane niezgodnie z
          obowiązującym prawem, możesz wnieść skargę do Prezesa Urzędu Ochrony
          Danych Osobowych.
        </P>
      </Section>
      <Section>
        <H2>Postanowienia końcowe</H2>
        <P>
          W zakresie nieuregulowanym niniejszą Polityką prywatności obowiązują
          przepisy z zakresu ochrony danych osobowych.
        </P>
        <P>
          O wszelkich zmianach wprowadzonych do niniejszej Polityki prywatności
          zostaniesz powiadomiony/powiadomiona drogą e-mailową oraz za pomocą
          informacji zamieszczonej na stronie Aplikacji.
        </P>
        <P>
          Zmiany w Polityce prywatności zaczynają obowiązywać w terminie 7
          (słownie: siedmiu) dni od dnia powiadomienia zgodnie z ust. 2.
        </P>
        <P>Niniejsza Polityka prywatności obowiązuje od dnia 29.07.2025 r.</P>
      </Section>
    </Page>
  );
};
