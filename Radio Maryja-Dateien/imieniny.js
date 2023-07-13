/*
 * Nameday   ver  2.0.1  2003-11-02
 * Copyright (c) 2002-2003 by Michal Nazarewicz (mina86@tlen.pl)
 *
 * This script is free software; It is ditributed under terms of
 * GNU Lesser General Public License. Copy of the license can be found
 * at www.gnu.org/licenses/licenses.html#LGPL
 *
 * Visit www.projektcode.prv.pl for more..
 */


//
// Tuday's date :)
//
var nameday_date = new Date(),
	nameday_day = nameday_date.getDate(),
	nameday_month = nameday_date.getMonth()+1;



//
// Object representing names
//
function NamedayNames(names) {
	if (names instanceof Array) {
		this.names = names;
	} else {
		this.names = names.split('|');
	}
}

NamedayNames.prototype = {
	join: function(sep, last_sep, limit) {
		// Init args
		switch (arguments.length) {
			case  0: sep = null;
			case  1: last_sep = null;
			case  2: limit = null;
			case  3: break;
			default: return false;
		}


		// Get names
		var names = this.getNames(limit);


		// Join
		if (sep==null) {
			sep = ', ';
		}
		if (last_sep==null) {
			return names.join(sep);
		} else {
			var str = '';
			for (var i = 0; i<names.length; i++) {
				if (i==names.length-1) {
					str += last_sep;
				} else if (i) {
					str += sep;
				}
				str += names[i];
			}
			return str;
		}
	},


	//
	// Returns names as formated string
	//
	toString: function(before, after, sep, last_sep, limit) {
		// Init args
		switch (arguments.length) {
			case  0: before = null;
			case  1: after = null;
			case  2: sep = null;
			case  3: last_sep = null;
			case  4: limit = null;
			case  5: break;
			default: return false;
		}


		// Join names
		var str = this.join(sep, last_sep, limit);
		if (!str) {
			return false;
		}


		// Return
		return (before==null?'':before) + str + (after==null?'':after);
	},


	//
	// Returns names in array (maximum number of names in array is limit
	// or there's no maximum number if limit==0 || limit==null)
	//
	getNames: function(limit) {
		// Check args;
		if (arguments.length>1) {
			return false;
		}

		// All requested
		if (arguments.length==0 || limit==null || limit<1 ||
			limit>=this.names.length) {
			return this.names;

		// Limit requested
		} else {
			var arr = new Array(limit);
			for (var i = 0; i<limit; i++) {
				arr[i] = names[i];
			}
			return arr;
		}
	},


	//
	// Get name at index
	//
	get: function(index) {
		return this.names[index];
	},


	//
	// Get number of names
	//
	count: function() {
		return this.names.length;
	}
};



//
// Object representing set of names for each day of year
//
function NamedaySet(array) {
	this.array = array;
}

NamedaySet.prototype = {
	//
	// Returns NamedayNames object with names of people who have nameday
	// today or in the dth of m  If d or m is null or omitted, todays day
	// and/or month is taken.
	// Note: Months are indexed from 1 !!
	//
	getNames: function(d, m) {
		switch (arguments.length) {
			case  0: d = null;
			case  1: m = null;
			case  2: break;
			default: return false;
		}

		if (d==null) {
			d = nameday_day;
		}
		if (m==null) {
			m = nameday_month;
		}

		return new NamedayNames(this.array[m-1][d-1]);
	}
};




//
// Main object
//
function Nameday() {
	this.sets = new Array();
}


Nameday.prototype = {
	//
	// Returns specyfied set
	//
	getSet: function(lang) {
		if (arguments.length!=1) {
			return false;
		}
		return this.sets['' + lang];
	},


	//
	// Adds set
	//
	addSet: function(lang, set) {
		if (arguments.length!=2) {
			return false;
		}
		if (set instanceof NamedaySet) {
			this.sets['' + lang] = set;
		} else {
			this.sets['' + lang] = new NamedaySet(set);
		}
	}
};

var nameday = new Nameday();



/*
 * Nameday Polish Extension  ver  1.4.2  2003-11-19
 * Copyright (c) 2002-2003 by Michal Nazarewicz (mina86@tlen.pl)
 *
 * This script is free software; It is ditributed under terms of
 * GNU Lesser General Public License. Copy of the license can be found
 * at www.gnu.org/licenses/licenses.html#LGPL
 */


//
// Converts names
//
NamedayNames.prototype.pl_convert = function(method) {
	if (arguments.length!=1) {
		return false;
	}
	if (method==0) {
		return new NamedayNames(this.names);
	}
	if (method!=1) {
		return false;
	}

	var ret = new Array(), name = '';
	for (var i = 0; i<this.names.length; i++) {
		name = this.names[i];

		var len = name.length,
			last3 = name.substring(len-3),
			last2 = name.substring(len-2),
			vowel3 = "aeioóuy".indexOf(name.charAt(len-4))!=-1,
			vowel2 = "aeioóuy".indexOf(name.charAt(len-3))!=-1;

		if (last3=="ego") {
			if (name.substring(len-4, 1)=='l') {
				name = name.substring(0, len-3);
			} else {
				name = name.substring(0, len-3) + "y";
			}
		} else if (last3=="ñca") {
			name = name.substring(0, len-3) + "niec";
		} else if (last3=="tra") {
			name = name.substring(0,len-3) + (vowel3?"tr":"ter");
		} else if (last2=="ka" && !vowel2) {
			name =  name.substring(0,len-2) + "ek";
		} else if (last2=="³a" && !vowel2) {
			name = name.substring(0, len-2) + "³a";
		} else {
			name = name.substring(0, len-1) +
				(last2.substring(2,1)=='a'?'':'a');
		}

		ret[i] = name;
	}
	return new NamedayNames(ret);
};


//
// For backward compatibility
//
function WypiszImieniny(before, after, sep, last_sep, method) {
	switch (arguments.length) {
		case 0: before = null;
		case 1: after = null;
		case 2: sep = null;
		case 3: last_sep = null;
		case 3: method = null;
	}


	var names = PobierzImieniny(sep, last_sep, method);
	if (!names) {
		return false;
	}


	document.write("" + before + names + after);
	return true;
}

function PobierzImieniny(sep, last_sep, method) {
	switch (arguments.length) {
		case 0: sep = null;
		case 1: last_sep = null;
		case 2: method = null;
	}
	if (method==null) {
		method = 0;
	}

	var names;
	if (!(names = nameday.getSet('pl')) || !(names = names.getNames()) ||
		!(names = names.pl_convert(method))) {
		return false;
	}

	return names.toString('', '', sep, last_sep);
}



/*
 * Nameday Polish Names Database  v 2.1
 * Database taken from infoludek.pl/~slawek/imieniny.html
 * +some corrections
 */


nameday.addSet('pl', new Array(
	new Array(
		"Mas³awa|Mieczys³awa|Mieszka",
		"Bazylego|Makarego|Narcyzy",
		"Arlety|Danuty|Lucjana",
		"Anieli|El¿biety|Tytusa",
		"Edwarda|Hanny|Szymona",
		"Kacpra|Melchiora|Baltazara",
		"Juliana|Lucjana|Walentyny",
		"Artura|Rajmunda|Seweryny",
		"Adriana|Alicji|Teresy",
		"Ady|Jana|Wilhelma",
		"Feliksa|Honoraty|Marty",
		"Bernarda|Czes³awy|Grety",
		"Bogumi³a|Bogumi³y|Weroniki",
		"Feliksa|Hilarego|Martyny",
		"Arnolda|Dory|Paw³a",
		"Marcelego|Walerii|W³odzimierza",
		"Antoniego|Henryki|Mariana",
		"Beatrycze|Ma³gorzaty|Piotra",
		"Erwiny|Henryka|Mariusza",
		"Fabiana|Mi³y|Sebastiana",
		"Agnieszki|Jaros³awa|Nory",
		"Dominiki|Mateusza|Wincentego",
		"Fernandy|Jana|Rajmundy",
		"Felicji|Roberta|S³awy",
		"Mi³osza|Paw³a|Tatiany",
		"Lutos³awa|Normy|Pauliny",
		"Anieli|Juliana|Przemys³awa",
		"Agnieszki|Kariny|Les³awa",
		"Franciszka|Konstancji|Salomei",
		"Martyny|Macieja|Teofila",
		"Joanny|Ksawerego|Luizy"
	),
	new Array(
		"Brygidy|Dobrogniewa|Ignacego",
		"Kornela|Marii|Miros³awy",
		"B³a¿eja|Joanny|Telimeny",
		"Andrzeja|Mariusza|Weroniki",
		"Agaty|Filipa|Justyniana",
		"Amandy|Bogdana|Doroty",
		"Ryszarda|Teodora|Wilhelminy",
		"Irminy|Piotra|Sylwii",
		"Bernarda|Eryki|Rajmunda",
		"Elwiry|Elizy|Jacka",
		"Bernadetty|Marii|Olgierda",
		"Czas³awa|Damiana|Normy",
		"Grzegorza|Les³awa|Katarzyny",
		"Liliany|Walentyny|Walentego",
		"Arnolda|Jowity|Georginy",
		"Danuty|Daniela|Juliany",
		"Donata|Gizeli|£ukasza",
		"Konstancji|Krystiana|Sylwany",
		"Bettiny|Konrada|Miros³awa",
		"Anety|Lecha|Leona",
		"Eleonory|Lenki|Kiejstuta",
		"Ma³gorzaty|Marty|Nikifora",
		"Damiana|Romana|Romany",
		"Boguty|Bogusza|Macieja",
		"Almy|Cezarego|Jaros³awa",
		"Bogumi³a|Eweliny|Miros³awa",
		"Gagrieli|Liwii|Leonarda",
		"Ludomira|Makarego|Wiliany",
		"Lecha|Lutomira|Wiktora"
	),
	new Array(
		"Albina|Antoniny|Rados³awy",
		"Halszki|Heleny|Karola",
		"Kingi|Maryna|Tycjana",
		"Adrianny|Kazimierza|Wac³awa",
		"Aurory|Fryderyka|Oliwii",
		"Jordana|Marcina|Ró¿y",
		"Flicyty|Kajetana|Pauli",
		"Beaty|Juliana|Wincentego",
		"Dominika|Franciszki|Katarzyny",
		"Bo¿ys³awy|Cypriana|Marcelego",
		"Konstantego|Ludos³awa|Rozyny",
		"Grzegorza|Justyny|Józefiny",
		"Bo¿eny|Krystyny|Marka",
		"Dalii|Leona|Matyldy",
		"Delfiny|Longina|Ludwiki",
		"Izabeli|Henryka|Oktawii",
		"Reginy|Patryka|Zdyszka",
		"Edwarda|Narcyza|Zbys³awa",
		"Aleksandryny|Józefa|Nicety",
		"Joachima|Kiry|Maurycego",
		"Benedykta|Lubomiry|Lubomira",
		"Bogus³awa|Jagody|Katarzyny",
		"Feliksa|Konrada|Zbys³awy",
		"Gabrieli|Marka|Seweryna",
		"Bolka|Cezaryny|Marioli",
		"Dory|Olgi|Teodora",
		"Ernesta|Jana|Marka",
		"Anieli|Kasrota|Soni",
		"Marka|Wiktoryny|Zenona",
		"Amelii|Dobromira|Leonarda",
		"Balbiny|Kamila|Kornelii"
	),
	new Array(
		"Chryzamtyny|Gra¿yny|Zygmunta",
		"Franciszka|Malwiny|W³adys³awa",
		"Pankracego|Renaty|Ryszarda",
		"Benedykta|Izodory|Wac³awy",
		"Ireny|Kleofasa|Wincentego",
		"Ady|Celestyny|Ireneusza",
		"Donata|Herminy|Rufina",
		"Amadeusza|Cezaryny|Juliany",
		"Mai|Marcelego|Wadima",
		"Borys³awy|makarego|Micha³a",
		"Filipa|Izoldy|Leona",
		"Juliusza|Lubos³awa|Wiktoryny",
		"Artemona|Justyny|Przemys³awy",
		"Bernarda|Martyny|Waleriana",
		"Adolfiny|Odetty|Wac³awa",
		"Bernarda|Biruty|Erwina",
		"Anicety|Klary|Rudolfina",
		"Apoloniusza|Bogus³awy|Goœcis³awy",
		"Alfa|Leonii|Tytusa",
		"Agnieszki|Amalii|Czecha",
		"Jaros³awa|Konrada|Selmy",
		"£ukasza|Kai|Nastazji",
		"Ilony|Jerzego|Wojciecha",
		"Bony|Horacji|Jerzego",
		"Jaros³awa|Marka|Wiki",
		"Marii|Marzeny|Ryszarda",
		"Sergiusza|Teofila|Zyty",
		"Bogny|Walerii|Witalisa",
		"Hugona|Piotra|Roberty",
		"Balladyny|Lilli|Mariana"
	),
	new Array(
		"Józefa|Lubomira|Ramony",
		"Longiny|Toli|Zygmunta",
		"Jarope³ka|Marii|Niny",
		"Floriana|Micha³a|Moniki",
		"Irydy|Tamary|Waldemara",
		"Beniny|Filipa|Judyty",
		"Augusta|Gizeli|Ludomiry",
		"Kornela|Lizy|Stanis³awa",
		"Grzegorza|Karoliny|Karola",
		"Antoniny|Izydory|Jana",
		"Igi|Mamerta|Miry",
		"Dominika|Imeldy|Pankracego",
		"Agnieszki|Magdaleny|Serwacego",
		"Bonifacego|Julity|Macieja",
		"Dionizego|Nadziei|Zofii",
		"Andrzeja|Jêdrzeja|Ma³gorzaty",
		"Brunony|S³awomira|Wery",
		"Alicji|Edwina|Eryka",
		"Celestyny|Iwony|Piotra",
		"Bazylego|Bernardyna|Krystyny",
		"Jana|Moniki|Wiktora",
		"Emila|Neleny|Romy",
		"Leoncjusza|Micha³a|Renaty",
		"Joanny|Zdenka|Zuzanny",
		"Borysa|Magdy|Marii-Magdaleny",
		"Eweliny|Jana|Paw³a",
		"Amandy|Jana|Juliana",
		"Augustyna|Ingi|Jaromira",
		"Benity|Maksymiliana|Teodozji",
		"Ferdynanda|Gryzeldy|Zyndrama",
		"Anieli|Feliksa|Kamili"
	),
	new Array(
		"Gracji|Jakuba|Konrada",
		"Erazma|Marianny|Marzeny",
		"Anatola|Leszka|Tamary",
		"Christy|Helgi|Karola",
		"Bonifacego|Kiry|Waltera",
		"Laury|Laurentego|Nory",
		"Ariadny|Jaros³awa|Roberta",
		"Ady|Celii|Medarda",
		"Anny-Marii|Felicjana|S³awoja",
		"Bogumi³a|Diany|Ma³gorzaty",
		"Barnaby|Benedykta|Flory",
		"Gwidona|Leonii|Niny",
		"Antoniego|Gracji|Lucjana",
		"Bazylego|Elizy|Justyny",
		"Jolanty|Lotara|Wita",
		"Aliny|Anety|Benona",
		"Laury|Leszka|Marcjana",
		"El¿biety|Marka|Pauli",
		"Gerwazego|Protazego|Sylwii",
		"Bogny|Rafaeli|Rafa³a",
		"Alicji|Alojzego|Rudolfa",
		"Pauliny|Sabiny|Tomasza",
		"Albina|Wandy|Zenona",
		"Danuty|Jana|Janiny",
		"£ucji|Witolda|Wilhelma",
		"Jana|Pauliny|Rudolfiny",
		"Cypriana|Emanueli|W³adys³awa",
		"Florentyny|Ligii|Leona",
		"Paw³a|Piotra|Salomei",
		"Arnolda|Emiliany|Lucyny"
	),
	new Array(
		"Bogusza|Haliny|Mariana",
		"Kariny|Serafiny|Urbana",
		"Anatola|Jacka|Miros³awy",
		"Aureli|Malwiny|Zygfryda",
		"Antoniego|Bart³omieja|Karoliny",
		"Dominiki|Jarope³ka|£ucji",
		"Estery|Kiry|Rudolfa",
		"Arnolda|Edgara|El¿biety",
		"Hieronima|Palomy|Weroniki",
		"Filipa|Sylwany|Witalisa",
		"Benedykta|Kariny|Olgi",
		"Brunona|Jana|Wery",
		"Danieli|Irwina|Ma³gorzaty",
		"Kamili|Kamila|Marcelego",
		"Henryka|Igi|W³odzimierza",
		"Eustachego|Mariki|Mirelli",
		"Aleksego|Bogdana|Martyny",
		"Kamila|Karoliny|Roberta",
		"Alfreny|Rufina|Wincentego",
		"Fryderyka|Ma³gorzaty|Seweryny",
		"Danieli|Wawrzyñca|Wiktora",
		"Magdaleny|Mileny|Wawrzyñca",
		"S³awy|S³awosza|¯elis³awy",
		"Kingi|Krystyna|Michaliny",
		"jakuba|Krzysztofa|Walentyny",
		"Anny|Miros³awy|Joachima",
		"Aureliusza|Natalii|Rudolfa",
		"Ady|Wiwiany|Sylwiusza",
		"Marty|Konstantego|Olafa",
		"Julity|Ludmi³y|Zdobys³awa",
		"Ignacego|Lodomiry|Romana"
	),
	new Array(
		"Jaros³awa|Justyny|Nadziei",
		"Gustawa|Kariny|Stefana",
		"Augustyna|Kamelii|Lidii",
		"Dominiki|Dominika|Protazego",
		"Emila|Karoliny|Kary",
		"Jakuba|S³awy|Wincentego",
		"Donaty|Olechny|Kajetana",
		"Izy|Rajmunda|Seweryna",
		"Klary|Romana|Rozyny",
		"Bianki|Borysa|Wawrzyñca",
		"Luizy|W³odzmierza|Zuzanny",
		"Hilarii|Juliana|Lecha",
		"Elwiry|Hipolita|Rados³awy",
		"Alfreda|Maksymiliana|Selmy",
		"Marii|Napoleona|Stelli",
		"Joachima|Nory|Stefana",
		"Anity|Elizy|Mirona",
		"Bogus³awa|Bronis³awa|Ilony",
		"Emilii|Julinana|Konstancji",
		"Bernarda|Sabiny|Samuela",
		"Franciszka|Kazimiery|Ruty",
		"Cezarego|Marii|Zygfryda",
		"Apolinarego|Mi³y|Ró¿y",
		"Bartosza|Jerzego|Maliny",
		"Belii|Ludwika|Luizy",
		"Ireneusza|Konstantego|Marii",
		"Cezarego|Ma³gorzaty|Moniki",
		"Adeliny|Erazma|Sobies³awa",
		"Beaty|Racibora|Sabiny",
		"Benona|Jowity|Szczêsnego",
		"Cyrusa|Izabeli|Rajmundy"
	),
	new Array(
		"Belindy|Bronisza|Idziego",
		"Dionizy|Izy|Juliana",
		"Joachima|Liliany|Szymona",
		"Dalii|Idy|Rocha",
		"Doroty|Justyna|Wawrzyñca",
		"Beaty|Eugeniusza|Lidy",
		"Reginy|Marka|Melchiora",
		"Czcibora|Marii|Rados³awa",
		"Aldony|Jakuba|Sergiusza",
		"Eligii|Irmy|£ukasza",
		"Dagny|Jacka|Prota",
		"Amadeusza|Gwidy|Sylwiny",
		"Apolinarego|Eugenii|Lubomira",
		"Bernarda|Mony|Roksany",
		"Albina|Lolity|Ronalda",
		"Jagienki|Kamili|Korneliusza",
		"Franciszka|Lamberty|Narcyza",
		"Ireny|Irminy|Stanis³awa",
		"Januarego|Konstancji|Leopolda",
		"Eustachego|Faustyny|Renaty",
		"Darii|Mateusza|Wawrzyñca",
		"Maury|Milany|Tomasza",
		"Bogus³awa|Liwiusza|Tekli",
		"Dory|Gerarda|Maryny",
		"Aureli|Kamila|Kleofasa",
		"Cypriana|Justyny|£ucji",
		"Damiana|Mirabeli|Wincentego",
		"Libuszy|Wac³awy|Wac³awa",
		"Michaliny|Micha³a|Rafa³a",
		"Geraldy|Honoriusza|Wery"
	),
	new Array(
		"Heloizy|Igora|Remigiusza",
		"Racheli|S³awy|Teofila",
		"Bogumi³a|Gerarda|Józefy",
		"Edwina|Ros³awy|Rozalii",
		"Flawii|Justyna|Rajmunda",
		"Artura|Fryderyki|Petry",
		"Krystyna|Marii|Marka",
		"Brygidy|Loreny|Marcina",
		"Arnolda|Ludwika|Sybili",
		"Franciszka|Loretty|Poli",
		"Aldony|Brunona|Emila",
		"Krystyny|Maksa|Serafiny",
		"Edwarda|Geraldyny|Teofila",
		"Alany|Damiana|Liwii",
		"Jadwigi|Leonarda|Teresy",
		"Ambro¿ego|Florentyny|Gaw³a",
		"Antonii|Ignacego|Wiktora",
		"Hanny|Klementyny|£ukasza",
		"Michaliny|Micha³a|Piotra",
		"Ireny|Kleopatry|Witalisa",
		"Celiny|Hilarego|Janusza",
		"Haliszki|Lody|Przybys³awa",
		"Edwarda|Marleny|Seweryna",
		"Arety|Marty|Marcina",
		"Ingi|Maurycego|Sambora",
		"Ewarysta|Lucyny|Lutos³awy",
		"Iwony|Noemi|Szymona",
		"Narcyza|Serafina|Wioletty",
		"Angeli|Przemys³awa|Zenobii",
		"Augustyny|£ukasza|Urbana",
		"Krzysztofa|Augusta|Saturnina"
	),
	new Array(
		"Konrada|Seweryny|Wiktoryny",
		"Bohdany|Henryka|Tobiasza",
		"Huberta|Mi³y|Sylwii",
		"Albertyny|Karola|Olgierda",
		"Balladyny|El¿biety|S³awomira",
		"Arletty|Feliksa|Leonarda",
		"Antoniego|Kaliny|Przemi³y",
		"Klaudii|Seweryna|Wiktoriusza",
		"Anatolii|Gracji|Teodora",
		"Leny|Lubomira|Natalii",
		"Bart³omieja|Gertrudy|Marcina",
		"Konrada|Renaty|Witolda",
		"Arkadii|Krystyna|Stanis³awy",
		"Emila|Laury|Rogera",
		"Amielii|Idalii|Leopolda",
		"Edmunda|Marii|Marka",
		"Grzegorza|Salomei|Walerii",
		"Klaudyny|Romana|Tomasza",
		"El¿biety|Faustyny|Paw³a",
		"Anatola|Edyty|Rafa³a",
		"Janusza|Marii|Reginy",
		"Cecylii|Jonatana|Marka",
		"Adeli|Felicyty|Klemensa",
		"Emmy|Flory|Romana",
		"El¿biety|Katarzyny|Klemensa",
		"Leona|Leonarda|Les³awy",
		"Franciszka|Kseni|Maksymiliana",
		"Jakuba|Stefana|Romy",
		"B³a¿eja|Margerity|Saturnina",
		"Andrzeja|Maury|Ondraszka"
	),
	new Array(
		"Blanki|Edmunda|Eligiusza",
		"Balbiny|Ksawerego|Pauliny",
		"Hilarego|Franciszki|Ksawery",
		"Barbary|Hieronima|Krystiana",
		"Kryspiny|Norberta|Sabiny",
		"Dionizji|Leontyny|Miko³aja",
		"Agaty|Dalii|Sobies³awa",
		"Delfiny|Marii|Wirginiusza",
		"Anety|Leokadii|Wies³awa",
		"Danieli|Bohdana|Julii",
		"Biny|Damazego|Waldemara",
		"Ady|Aleksandra|Dagmary",
		"Dalidy|Juliusza|£ucji",
		"Alfreda|Izydora|Zoriny",
		"Celiny|Ireneusza|Niny",
		"Albiny|Sebastiana|Zdzis³awy",
		"Jolanty|£ukasza|Olimpii",
		"Bogus³awa|Gracjana|Laury",
		"Beniaminy|Dariusza|Gabrieli",
		"Bogumi³y|Dominika|Zefiryna",
		"Honoraty|Seweryny|Tomasza",
		"Bo¿eny|Drogomira|Zenona",
		"Dagny|S³awomiry|Wiktora",
		"Adama|Ewy|Irminy",
		"Anety|Glorii|Piotra",
		"Dionizego|Kaliksta|Szczepana",
		"Fabioli|Jana|¯anety",
		"Antoniusza|Cezarego|Teofilii",
		"Dawida|Dionizy|Tomasza",
		"Eugeniusza|Katarzyny|Sabiny",
		"Mariusza|Melanii|Sylwestra"
	)
));
