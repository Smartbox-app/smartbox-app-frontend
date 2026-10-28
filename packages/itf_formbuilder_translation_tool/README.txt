

getTranslatableError(
new TranslatableError(

1. Szukać plików .ts, można ustawić wiele ścieżek (folderów) na podstawie konfiguracji itfformbuilder.json - np. FE, BE, w node_modules.
2. Szukać reg expem:
 - getTranslatableError(
 - TranslatableError(
3. Sprawdzać, czy zaraz po tym jest ' lub ". Jeżeli nie, to komunikat console.error(), że tam powinny być stałe stringi.

4. Otwieramy dany JSON
5. Iterujemy po znalezionych elementach
6. Jak nie ma tego w JSON -> komunikat console.info(), że dodajemy i dodajemy.
7. Jak jest to w JSON -> olewamy.
8. Kolejne iterowanie - teraz po poprzednich kluczach.
9. Jeżeli coś wcześniej istniało, a teraz nie, to komunikat console.warn(), że już prawdopodobnie zbędne
10. Zapisujemy wynikowy JSON w wybranej ścieżce.