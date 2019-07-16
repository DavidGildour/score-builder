export default {
    navbar: {
        close: 'Zamknij',
        help: 'Pomoc',
        helpContent: [
            `Kliknij na pięciolinii żeby dodać nutę.`,
            `Aby zmienić długość i rodzaj dodawanej nuty wybierz jedną z opcji nad pięciolinią.`,
            `Kliknij na nutę, aby ją zaznaczyć. Strzałki w górę i w dół oraz klawisze 'PageUp' i 'PageDown' zmieniają wysokość wybranej nuty
            odpowiednio o półton i oktawę. Strzałki w lewo i prawo zmieniają zaznaczoną nutę na sąsiednią w wybranym głosie.`,
            `Aby zmienić wybrany głos klinkij na nutę w tym głosie, wybierz go z listy,
            lub wciśnij klawisz 'Tab' ('Shift' + 'Tab'), aby zaznaczyć następny (poprzedni) głos.
            Przycisk 'Usuń głos' usuwa ostatni dodany głos (ale tylko gdy jest pusty).
            Przycisk 'Wyczyść' usuwa wszystkie nuty ze WSZYSTKICH głosów. Zalecam ostrożność.`,
            `Do zmiany tempa odtwarzanego utworu służy suwak pod pięciolinią. Pole 'Metronom' włącza/wyłącza metronom podczas odtwarzania.`,
            `Aplikacja umożliwia wygenerowanie losowej melodii w każdym z głosów oraz kontrolę tej losowości.
            Pole 'Pauzy' umożliwia wygenerowanie pauz w melodii. Pole 'Diatoniczna' decyduje o tym, czy generowana melodia
            będzie zawierać nuty tylko z wybranej tonacji (będzie diatoniczna) czy nuty z całej skali chromatycznej (nie będzie diatoniczna).
            Pola 'Najdłuższa' i 'Najkrótsza nuta' pozwala wybrać odpowiednio najkrótszą i najdłuższą dostępną nutę w melodii.
            Pole 'Największy interwał' pozwala wybrać największy dostępny interwał między dwoma sąsiednimi nutami w głosie (interwał melodyczny).
            Nie służy ono do ustalania interwałów harmonicznych między głosami.
            Ponadto wygenerowana melodia nie będzie zawierać nut o wysokości
            ponad jedną linię nad najwyższą i poniżej jednej linii pod najniższą linią w danym kluczu.`
        ],
        about: 'O aplikacji',
        aboutContent: [
            `Witaj w Score Builder!`,
            `Score Builder to aplikacja pozwalająca na tworzenie i edycję zapisu nutowego z dowolnego urządzenia wyposażonego w przeglądarkę
            obsługującą JavaScript.`,
            `Interfejs aplikacji napisany jest w całości we frameworku React.js w wersji 16.8.6.
            Korzysta ona również z innych darmowych bibliotek JavaScript i CSS, takich jak:`,
            `- VexFlow v1.2.89`,
            `- midi-sounds-react v1.2.54`,
            `- Materialize CSS v1.0.0`,
            `W tym miejscu chciałbym podziękować wszystkim wspaniałym osobom rozwijającym te biblioteki; bez Was ta aplikacja na pewno by nie powstała!
            W szególności podziękowania należą się twórcy VexFlow - Mohit Muthanna Cheppudira - za wspaniale udokumentowaną i przepotężną bibliotekę
            do renderowania zapisu nutowego. Robi wszystko to, co możesz od niej wymagać i jeszcze więcej.`
        ],
        lang: 'Język',
    },
    noteNames: {
        wd: 'Cała nuta z kropką',
        w: 'Cała nuta',
        hd: 'Cała nuta z kropką',
        h: 'Półnuta',
        qd: 'Ćwierćnuta z kropką',
        q: 'Ćwierćnuta',
        '8d': 'Ósemka z kropką',
        '8': 'Ósemka',
        '16d': 'Szesnastka z kropką',
        '16': 'Szesnastka',
        '32d': 'Trzydziestkadwójka z kropką',
        '32': 'Trzydziestkadwójka',
        '64': 'Sześćdziesiątkaczwórka'
    },
    noteModifiers: {
        dot: 'Z kropką',
        rest: 'Pauza',
    },
    player: {
        playVoice: 'Odtwórz wybrany głos',
        playAll: 'Odtwórz wszystkie głosy',
        metro: 'Metronom',
    },
    options: {
        clef: {
            label: 'Wybierz klucz',
            clefs: {
                treble: 'Wiolinowy',
                bass: 'Basowy',
                alto: 'Altowy',
                tenor: 'Tenorowy',
                percussion: 'Perkusyjny',
                soprano: 'Sopranowy',
                mezzoSoprano: 'Mezzo sopranowy',
                baritone_c: 'Barytonowy (C)',
                baritone_f: 'Barytonowy (F)',
                subbass: 'Subbasowy',
                french: 'Francuski',
            }
        },
        key: {
            label: 'Wybierz tonację',
            keys: {
                Cb: 'Ces-dur/As-moll',
                Gb: 'Ges-dur/Es-moll',
                Db: 'Des-dur/B-moll',
                Ab: 'As-dur/F-moll',
                Eb: 'Es-dur/C-moll',
                Bb: 'B-dur/G-moll',
                F: 'F-dur/D-moll',
                C: 'C-dur/A-moll',
                G: 'G-dur/E-moll',
                D: 'D-dur/H-moll',
                A: 'A-dur/Fis-moll',
                E: 'E-dur/Cis-moll',
                B: 'H-dur/Gis-moll',
                Fsh: 'Fis-dur/Dis-moll',
                Csh: 'Cis-dur/Ais-moll',
            }
        },
        time: {
            numLabel: 'Ilość uderzeń',
            typeLabel: 'Rodzaj uderzeń'
        },
        voices: {
            add: 'Dodaj głos',
            remove: 'Usuń głos',
            clear: 'Wyczyść',
            mapping: ['Pierwszy', 'Drugi', 'Trzeci', 'Czwarty'],
            label: 'Wybierz głos',
        },
        notes: {
            add: 'Dodaj losową nutę',
            remove: 'Usuń ostatnią nutę',
        },
        melody: {
            rests: 'Pauzy',
            diatonic: 'Diatoniczna',
            shortLabel: 'Najkrótsza nuta',
            longLabel: 'Najdłuższa nuta',
            intervalLabel: 'Największy interwał',
            generate: 'Wygeneruj melodię',
            intervals: {
                m2: 'Sekunda mniejsza',
                M2: 'Sekunda większa',
                m3: 'Tercja mniejsza',
                M3: 'Tercja większa',
                P4: 'Kwarta czysta',
                A4: 'Tryton',
                P5: 'Kwinta czysta',
                m6: 'Seksta mniejsza',
                M6: 'Seksta większa',
                m7: 'Septyma mniejsza',
                M7: 'Septyma większa',
                P8: 'Oktawa czysta',
            }
        }
    }
};