# Format der JSON-Wörterdatei

*Momentan nur Nomen und Verben berücksichtigt(WIP), andere Wortarten können enthalten sein, werden sich aber wahrscheinlich ändern.*

## Allgemeine Felder

### `id` - Einzigartige ID der Datei/Wörter

Der Aufbau soll den DBus Interface Namen, beschrieben in der [DBus-Spezifikation, Abschnitt "Interface names"](https://dbus.freedesktop.org/doc/dbus-specification.html#message-protocol-names-interface) folgen.

*Beispiel*: `at.veritas.Mir1Ahs56.Lektion1`

### `desc` - Beschreibung

Dieses Feld soll eine kurze Beschreibung der Vokabel enthalten.

*Beispiel*: `Wörter der ersten Lektion von "Medias in Res!" Bd. 1 für die 5/6. Klasse AHS (Veritas Verlag)`

### `comment` - Sonstige Kommentare

Dieses optionale Feld kann weitere Kommentare des Autors über die Datei enthalten.

### `data[]` - Wortarray

Dieses Array enthält die zu prüfenden Vokabel. Die Inhalte werden in den folgenden Absätzen beschrieben.

### `data[].gr` - Grammatik des Wortes:

Diese besteht aus mehreren aufeinanderfolgenden Buchstaben, deren optionales Vorkommen und Reihenfolge bei den Entsprechenden Wortarten weiter unten dokumentiert sind.

- Wortarten

  - `n`omen
  - `v`erb
  - Ad`j`ektiv
  - `a`dverb
  - `k`onjunktion
  - `p`ronomen


- Geschlecht

  - `f`eminin: weiblich
  - `m`askulin: männlich
  - `n`eotrum: sächlich
  <!-- **x**: egal -->


- Deklination

  - `a`/`o`/`k`/`m`/`i`/`e`/`u`
  - `c`ustom: jeder Fall einzeln


- Konjugation

  - `a`/`e`/`k`/`i`/`m`

### `data[].tr[]` - Übersetzung ins Deutsche

Dieses Array(!) enthält einen oder mehrere Strings mit Übersetzungen ins Deutsche.

## Nomen

### `data[].gr` - Grammatik

Dieses Feld enthält in dieser Reihenfolge folgende Informationen:

1. Wortart ist `n`
2. Geschlecht
3. Deklination.

### `data[].sg1` - Erster Fall Singular

Dieses Element enthält das Wort im ersten Fall Singular (z.B. `amicus`).

### `data[].st` - Wortstamm

Dieses Element gibt den Wortstamm des Nomens an (z.B `amic`).

## Verben

### `data[].gr` - Grammatik

Dieses Feld enthält folgende Informationen:

1. Wortart ist `v`
2. Konjugation

### `data[].inf` - Infinitiv

Dieses Element enthält das Infinitiv des Verbs (z.B `audire`).

### `data[].st` - Wortstamm

Dieses Element enthält den Wortstamm des Verbs (z.B `aud`).

### `data[].p_st` - Wortstamm Perfekt

Dieses Element enthält den Wortstamm des Verbs im Perfekt (z.B. `audiv`).

### `data[].ppp_st` - Wortstamm Partizip Perfekt Passiv

Dieses Element enthält den Wortstamm des Verbs im Partizip Perfekt Passiv (z.B. `audit`).

## Adjektive

### `data[].gr` - Grammatik

Diese Element enthält folgende Infos:

1. Wortart ist `j`
2. Deklination(nur `a` und `k`)

### `data[].st` - Wortstamm

Dieses Element enthält den Stamm des Adjektivs. (z.B. `parv`)

### `data[].sg1[]`

Dieses Array enthält bei der `k` Dekl. die ersten Fälle(Sg) in der Reihenholge m/f-n bzw. m-f-n

<!-- EOF -->
