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
			vowel3 = "aeio�uy".indexOf(name.charAt(len-4))!=-1,
			vowel2 = "aeio�uy".indexOf(name.charAt(len-3))!=-1;

		if (last3=="ego") {
			if (name.substring(len-4, 1)=='l') {
				name = name.substring(0, len-3);
			} else {
				name = name.substring(0, len-3) + "y";
			}
		} else if (last3=="�ca") {
			name = name.substring(0, len-3) + "niec";
		} else if (last3=="tra") {
			name = name.substring(0,len-3) + (vowel3?"tr":"ter");
		} else if (last2=="ka" && !vowel2) {
			name =  name.substring(0,len-2) + "ek";
		} else if (last2=="�a" && !vowel2) {
			name = name.substring(0, len-2) + "�a";
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
		"Mas�awa|Mieczys�awa|Mieszka",
		"Bazylego|Makarego|Narcyzy",
		"Arlety|Danuty|Lucjana",
		"Anieli|El�biety|Tytusa",
		"Edwarda|Hanny|Szymona",
		"Kacpra|Melchiora|Baltazara",
		"Juliana|Lucjana|Walentyny",
		"Artura|Rajmunda|Seweryny",
		"Adriana|Alicji|Teresy",
		"Ady|Jana|Wilhelma",
		"Feliksa|Honoraty|Marty",
		"Bernarda|Czes�awy|Grety",
		"Bogumi�a|Bogumi�y|Weroniki",
		"Feliksa|Hilarego|Martyny",
		"Arnolda|Dory|Paw�a",
		"Marcelego|Walerii|W�odzimierza",
		"Antoniego|Henryki|Mariana",
		"Beatrycze|Ma�gorzaty|Piotra",
		"Erwiny|Henryka|Mariusza",
		"Fabiana|Mi�y|Sebastiana",
		"Agnieszki|Jaros�awa|Nory",
		"Dominiki|Mateusza|Wincentego",
		"Fernandy|Jana|Rajmundy",
		"Felicji|Roberta|S�awy",
		"Mi�osza|Paw�a|Tatiany",
		"Lutos�awa|Normy|Pauliny",
		"Anieli|Juliana|Przemys�awa",
		"Agnieszki|Kariny|Les�awa",
		"Franciszka|Konstancji|Salomei",
		"Martyny|Macieja|Teofila",
		"Joanny|Ksawerego|Luizy"
	),
	new Array(
		"Brygidy|Dobrogniewa|Ignacego",
		"Kornela|Marii|Miros�awy",
		"B�a�eja|Joanny|Telimeny",
		"Andrzeja|Mariusza|Weroniki",
		"Agaty|Filipa|Justyniana",
		"Amandy|Bogdana|Doroty",
		"Ryszarda|Teodora|Wilhelminy",
		"Irminy|Piotra|Sylwii",
		"Bernarda|Eryki|Rajmunda",
		"Elwiry|Elizy|Jacka",
		"Bernadetty|Marii|Olgierda",
		"Czas�awa|Damiana|Normy",
		"Grzegorza|Les�awa|Katarzyny",
		"Liliany|Walentyny|Walentego",
		"Arnolda|Jowity|Georginy",
		"Danuty|Daniela|Juliany",
		"Donata|Gizeli|�ukasza",
		"Konstancji|Krystiana|Sylwany",
		"Bettiny|Konrada|Miros�awa",
		"Anety|Lecha|Leona",
		"Eleonory|Lenki|Kiejstuta",
		"Ma�gorzaty|Marty|Nikifora",
		"Damiana|Romana|Romany",
		"Boguty|Bogusza|Macieja",
		"Almy|Cezarego|Jaros�awa",
		"Bogumi�a|Eweliny|Miros�awa",
		"Gagrieli|Liwii|Leonarda",
		"Ludomira|Makarego|Wiliany",
		"Lecha|Lutomira|Wiktora"
	),
	new Array(
		"Albina|Antoniny|Rados�awy",
		"Halszki|Heleny|Karola",
		"Kingi|Maryna|Tycjana",
		"Adrianny|Kazimierza|Wac�awa",
		"Aurory|Fryderyka|Oliwii",
		"Jordana|Marcina|R�y",
		"Flicyty|Kajetana|Pauli",
		"Beaty|Juliana|Wincentego",
		"Dominika|Franciszki|Katarzyny",
		"Bo�ys�awy|Cypriana|Marcelego",
		"Konstantego|Ludos�awa|Rozyny",
		"Grzegorza|Justyny|J�zefiny",
		"Bo�eny|Krystyny|Marka",
		"Dalii|Leona|Matyldy",
		"Delfiny|Longina|Ludwiki",
		"Izabeli|Henryka|Oktawii",
		"Reginy|Patryka|Zdyszka",
		"Edwarda|Narcyza|Zbys�awa",
		"Aleksandryny|J�zefa|Nicety",
		"Joachima|Kiry|Maurycego",
		"Benedykta|Lubomiry|Lubomira",
		"Bogus�awa|Jagody|Katarzyny",
		"Feliksa|Konrada|Zbys�awy",
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
		"Chryzamtyny|Gra�yny|Zygmunta",
		"Franciszka|Malwiny|W�adys�awa",
		"Pankracego|Renaty|Ryszarda",
		"Benedykta|Izodory|Wac�awy",
		"Ireny|Kleofasa|Wincentego",
		"Ady|Celestyny|Ireneusza",
		"Donata|Herminy|Rufina",
		"Amadeusza|Cezaryny|Juliany",
		"Mai|Marcelego|Wadima",
		"Borys�awy|makarego|Micha�a",
		"Filipa|Izoldy|Leona",
		"Juliusza|Lubos�awa|Wiktoryny",
		"Artemona|Justyny|Przemys�awy",
		"Bernarda|Martyny|Waleriana",
		"Adolfiny|Odetty|Wac�awa",
		"Bernarda|Biruty|Erwina",
		"Anicety|Klary|Rudolfina",
		"Apoloniusza|Bogus�awy|Go�cis�awy",
		"Alfa|Leonii|Tytusa",
		"Agnieszki|Amalii|Czecha",
		"Jaros�awa|Konrada|Selmy",
		"�ukasza|Kai|Nastazji",
		"Ilony|Jerzego|Wojciecha",
		"Bony|Horacji|Jerzego",
		"Jaros�awa|Marka|Wiki",
		"Marii|Marzeny|Ryszarda",
		"Sergiusza|Teofila|Zyty",
		"Bogny|Walerii|Witalisa",
		"Hugona|Piotra|Roberty",
		"Balladyny|Lilli|Mariana"
	),
	new Array(
		"J�zefa|Lubomira|Ramony",
		"Longiny|Toli|Zygmunta",
		"Jarope�ka|Marii|Niny",
		"Floriana|Micha�a|Moniki",
		"Irydy|Tamary|Waldemara",
		"Beniny|Filipa|Judyty",
		"Augusta|Gizeli|Ludomiry",
		"Kornela|Lizy|Stanis�awa",
		"Grzegorza|Karoliny|Karola",
		"Antoniny|Izydory|Jana",
		"Igi|Mamerta|Miry",
		"Dominika|Imeldy|Pankracego",
		"Agnieszki|Magdaleny|Serwacego",
		"Bonifacego|Julity|Macieja",
		"Dionizego|Nadziei|Zofii",
		"Andrzeja|J�drzeja|Ma�gorzaty",
		"Brunony|S�awomira|Wery",
		"Alicji|Edwina|Eryka",
		"Celestyny|Iwony|Piotra",
		"Bazylego|Bernardyna|Krystyny",
		"Jana|Moniki|Wiktora",
		"Emila|Neleny|Romy",
		"Leoncjusza|Micha�a|Renaty",
		"Joanny|Zdenka|Zuzanny",
		"Borysa|Magdy|Marii-Magdaleny",
		"Eweliny|Jana|Paw�a",
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
		"Ariadny|Jaros�awa|Roberta",
		"Ady|Celii|Medarda",
		"Anny-Marii|Felicjana|S�awoja",
		"Bogumi�a|Diany|Ma�gorzaty",
		"Barnaby|Benedykta|Flory",
		"Gwidona|Leonii|Niny",
		"Antoniego|Gracji|Lucjana",
		"Bazylego|Elizy|Justyny",
		"Jolanty|Lotara|Wita",
		"Aliny|Anety|Benona",
		"Laury|Leszka|Marcjana",
		"El�biety|Marka|Pauli",
		"Gerwazego|Protazego|Sylwii",
		"Bogny|Rafaeli|Rafa�a",
		"Alicji|Alojzego|Rudolfa",
		"Pauliny|Sabiny|Tomasza",
		"Albina|Wandy|Zenona",
		"Danuty|Jana|Janiny",
		"�ucji|Witolda|Wilhelma",
		"Jana|Pauliny|Rudolfiny",
		"Cypriana|Emanueli|W�adys�awa",
		"Florentyny|Ligii|Leona",
		"Paw�a|Piotra|Salomei",
		"Arnolda|Emiliany|Lucyny"
	),
	new Array(
		"Bogusza|Haliny|Mariana",
		"Kariny|Serafiny|Urbana",
		"Anatola|Jacka|Miros�awy",
		"Aureli|Malwiny|Zygfryda",
		"Antoniego|Bart�omieja|Karoliny",
		"Dominiki|Jarope�ka|�ucji",
		"Estery|Kiry|Rudolfa",
		"Arnolda|Edgara|El�biety",
		"Hieronima|Palomy|Weroniki",
		"Filipa|Sylwany|Witalisa",
		"Benedykta|Kariny|Olgi",
		"Brunona|Jana|Wery",
		"Danieli|Irwina|Ma�gorzaty",
		"Kamili|Kamila|Marcelego",
		"Henryka|Igi|W�odzimierza",
		"Eustachego|Mariki|Mirelli",
		"Aleksego|Bogdana|Martyny",
		"Kamila|Karoliny|Roberta",
		"Alfreny|Rufina|Wincentego",
		"Fryderyka|Ma�gorzaty|Seweryny",
		"Danieli|Wawrzy�ca|Wiktora",
		"Magdaleny|Mileny|Wawrzy�ca",
		"S�awy|S�awosza|�elis�awy",
		"Kingi|Krystyna|Michaliny",
		"jakuba|Krzysztofa|Walentyny",
		"Anny|Miros�awy|Joachima",
		"Aureliusza|Natalii|Rudolfa",
		"Ady|Wiwiany|Sylwiusza",
		"Marty|Konstantego|Olafa",
		"Julity|Ludmi�y|Zdobys�awa",
		"Ignacego|Lodomiry|Romana"
	),
	new Array(
		"Jaros�awa|Justyny|Nadziei",
		"Gustawa|Kariny|Stefana",
		"Augustyna|Kamelii|Lidii",
		"Dominiki|Dominika|Protazego",
		"Emila|Karoliny|Kary",
		"Jakuba|S�awy|Wincentego",
		"Donaty|Olechny|Kajetana",
		"Izy|Rajmunda|Seweryna",
		"Klary|Romana|Rozyny",
		"Bianki|Borysa|Wawrzy�ca",
		"Luizy|W�odzmierza|Zuzanny",
		"Hilarii|Juliana|Lecha",
		"Elwiry|Hipolita|Rados�awy",
		"Alfreda|Maksymiliana|Selmy",
		"Marii|Napoleona|Stelli",
		"Joachima|Nory|Stefana",
		"Anity|Elizy|Mirona",
		"Bogus�awa|Bronis�awa|Ilony",
		"Emilii|Julinana|Konstancji",
		"Bernarda|Sabiny|Samuela",
		"Franciszka|Kazimiery|Ruty",
		"Cezarego|Marii|Zygfryda",
		"Apolinarego|Mi�y|R�y",
		"Bartosza|Jerzego|Maliny",
		"Belii|Ludwika|Luizy",
		"Ireneusza|Konstantego|Marii",
		"Cezarego|Ma�gorzaty|Moniki",
		"Adeliny|Erazma|Sobies�awa",
		"Beaty|Racibora|Sabiny",
		"Benona|Jowity|Szcz�snego",
		"Cyrusa|Izabeli|Rajmundy"
	),
	new Array(
		"Belindy|Bronisza|Idziego",
		"Dionizy|Izy|Juliana",
		"Joachima|Liliany|Szymona",
		"Dalii|Idy|Rocha",
		"Doroty|Justyna|Wawrzy�ca",
		"Beaty|Eugeniusza|Lidy",
		"Reginy|Marka|Melchiora",
		"Czcibora|Marii|Rados�awa",
		"Aldony|Jakuba|Sergiusza",
		"Eligii|Irmy|�ukasza",
		"Dagny|Jacka|Prota",
		"Amadeusza|Gwidy|Sylwiny",
		"Apolinarego|Eugenii|Lubomira",
		"Bernarda|Mony|Roksany",
		"Albina|Lolity|Ronalda",
		"Jagienki|Kamili|Korneliusza",
		"Franciszka|Lamberty|Narcyza",
		"Ireny|Irminy|Stanis�awa",
		"Januarego|Konstancji|Leopolda",
		"Eustachego|Faustyny|Renaty",
		"Darii|Mateusza|Wawrzy�ca",
		"Maury|Milany|Tomasza",
		"Bogus�awa|Liwiusza|Tekli",
		"Dory|Gerarda|Maryny",
		"Aureli|Kamila|Kleofasa",
		"Cypriana|Justyny|�ucji",
		"Damiana|Mirabeli|Wincentego",
		"Libuszy|Wac�awy|Wac�awa",
		"Michaliny|Micha�a|Rafa�a",
		"Geraldy|Honoriusza|Wery"
	),
	new Array(
		"Heloizy|Igora|Remigiusza",
		"Racheli|S�awy|Teofila",
		"Bogumi�a|Gerarda|J�zefy",
		"Edwina|Ros�awy|Rozalii",
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
		"Ambro�ego|Florentyny|Gaw�a",
		"Antonii|Ignacego|Wiktora",
		"Hanny|Klementyny|�ukasza",
		"Michaliny|Micha�a|Piotra",
		"Ireny|Kleopatry|Witalisa",
		"Celiny|Hilarego|Janusza",
		"Haliszki|Lody|Przybys�awa",
		"Edwarda|Marleny|Seweryna",
		"Arety|Marty|Marcina",
		"Ingi|Maurycego|Sambora",
		"Ewarysta|Lucyny|Lutos�awy",
		"Iwony|Noemi|Szymona",
		"Narcyza|Serafina|Wioletty",
		"Angeli|Przemys�awa|Zenobii",
		"Augustyny|�ukasza|Urbana",
		"Krzysztofa|Augusta|Saturnina"
	),
	new Array(
		"Konrada|Seweryny|Wiktoryny",
		"Bohdany|Henryka|Tobiasza",
		"Huberta|Mi�y|Sylwii",
		"Albertyny|Karola|Olgierda",
		"Balladyny|El�biety|S�awomira",
		"Arletty|Feliksa|Leonarda",
		"Antoniego|Kaliny|Przemi�y",
		"Klaudii|Seweryna|Wiktoriusza",
		"Anatolii|Gracji|Teodora",
		"Leny|Lubomira|Natalii",
		"Bart�omieja|Gertrudy|Marcina",
		"Konrada|Renaty|Witolda",
		"Arkadii|Krystyna|Stanis�awy",
		"Emila|Laury|Rogera",
		"Amielii|Idalii|Leopolda",
		"Edmunda|Marii|Marka",
		"Grzegorza|Salomei|Walerii",
		"Klaudyny|Romana|Tomasza",
		"El�biety|Faustyny|Paw�a",
		"Anatola|Edyty|Rafa�a",
		"Janusza|Marii|Reginy",
		"Cecylii|Jonatana|Marka",
		"Adeli|Felicyty|Klemensa",
		"Emmy|Flory|Romana",
		"El�biety|Katarzyny|Klemensa",
		"Leona|Leonarda|Les�awy",
		"Franciszka|Kseni|Maksymiliana",
		"Jakuba|Stefana|Romy",
		"B�a�eja|Margerity|Saturnina",
		"Andrzeja|Maury|Ondraszka"
	),
	new Array(
		"Blanki|Edmunda|Eligiusza",
		"Balbiny|Ksawerego|Pauliny",
		"Hilarego|Franciszki|Ksawery",
		"Barbary|Hieronima|Krystiana",
		"Kryspiny|Norberta|Sabiny",
		"Dionizji|Leontyny|Miko�aja",
		"Agaty|Dalii|Sobies�awa",
		"Delfiny|Marii|Wirginiusza",
		"Anety|Leokadii|Wies�awa",
		"Danieli|Bohdana|Julii",
		"Biny|Damazego|Waldemara",
		"Ady|Aleksandra|Dagmary",
		"Dalidy|Juliusza|�ucji",
		"Alfreda|Izydora|Zoriny",
		"Celiny|Ireneusza|Niny",
		"Albiny|Sebastiana|Zdzis�awy",
		"Jolanty|�ukasza|Olimpii",
		"Bogus�awa|Gracjana|Laury",
		"Beniaminy|Dariusza|Gabrieli",
		"Bogumi�y|Dominika|Zefiryna",
		"Honoraty|Seweryny|Tomasza",
		"Bo�eny|Drogomira|Zenona",
		"Dagny|S�awomiry|Wiktora",
		"Adama|Ewy|Irminy",
		"Anety|Glorii|Piotra",
		"Dionizego|Kaliksta|Szczepana",
		"Fabioli|Jana|�anety",
		"Antoniusza|Cezarego|Teofilii",
		"Dawida|Dionizy|Tomasza",
		"Eugeniusza|Katarzyny|Sabiny",
		"Mariusza|Melanii|Sylwestra"
	)
));
