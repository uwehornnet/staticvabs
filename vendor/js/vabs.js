import VabsWrapper from './components/vabswrapper.js';

const translation = {
	"de": {
		"button_book": "kostenpflichtig buchen",
		"button_contact": "Formular absenden",
		"button_message_sent": "abgesendet",
		"button_next": "weiter",
		"button_success": "Wir haben deine Email erhalten",
		"cart_disclaimer_text": "Mit Absenden dieses Formulares stimmen Sie unserer Datenschutzbestimmung zu.",
		"form_label_datefrom": "Anreise",
		"form_label_dateto": "Abreise",
		"form_label_email": "Emailadresse",
		"form_label_firstname": "Vorname",
		"form_label_lastname": "Nachname",
		"form_label_interest": "Interesse",
		"form_label_interest_inner": "Interesse wählen",
		"form_label_lastname": "Nachname",
		"form_label_mobile": "Telefonnummer",
		"form_label_note": "Bemerkung",
		"title_confirmation": "Bitte überprüfen Sie Ihr Eingabe",
		"title_course": "Kursauswahl",
		"title_persdata": "Persönliche Daten",
	},
	"en": {
		"button_book": "",
		"button_contact": "",
		"button_message_sent": "",
		"button_next": "",
		"button_success": "",
		"cart_disclaimer_text": "",
		"form_label_datefrom": "",
		"form_label_dateto": "",
		"form_label_email": "",
		"form_label_firstname": "",
		"form_label_lastname": "",
		"form_label_interest": "",
		"form_label_interest_inner": "",
		"form_label_lastname": "",
		"form_label_mobile": "",
		"form_label_note": "",
		"title_confirmation": "",
		"title_course": "",
		"title_persdata": "",
	}
};

new VabsWrapper(document.querySelectorAll('.vabs-api-form'), '/vabs/handler/ajaxHandler.php', translation, 'de');
