import BookingWrapper from './bookingwrapper.js';
import ContactWrapper from './contactwrapper.js';

const flatpickr = require("flatpickr");
import rangePlugin from '../../../node_modules/flatpickr/dist/plugins/rangePlugin.js';

export default class VabsWrapper {
	constructor(elements, url, lang = null) {
		this.url = url;
		this.lang = lang;
		this.forms = {};
		this.init(elements);
	}

	init(selectors) {
		selectors.forEach((elem, index) => {
			if (elem.dataset.form === 'booking') {
				this.forms[index] = new BookingWrapper(this.url, this.lang[elem.dataset.lang]);
				this.createBookingForm(elem, this.forms[index], elem.dataset.lang);
			}

			if (elem.dataset.form === 'contact') {
				this.forms[index] = new ContactWrapper(this.url, this.lang[elem.dataset.lang]);
				this.createContactForm(elem, this.forms[index], elem.dataset.lang);
			}
		})

	}

	createContactForm(elem, wrapper, lang) {

		/**
		 * create formwrapper
		 */
		const s = this.lang[lang]['button_contact'] ? this.lang[lang]['button_contact'] : 'Formular absenden';
		const formwrapper = this.formWrapper(wrapper, s);

		/**
		 * create user form
		 */
		formwrapper.querySelector('.vabsform__body').append(this.userform(wrapper, lang, true));

		/**
		 * init flatpickr
		 */
		this.flatPickr(formwrapper);

		/**
		 * append Interests to select field
		 */
		this.appendInterest(formwrapper);

		/**
		 * append created formwrapper to each given element
		 */
		elem.append(formwrapper);
		elem.querySelector('button .loading').style.display = 'none';
	}

	createBookingForm(elem, wrapper, lang) {

		/**
		 * create formwrapper
		 */
		const s = this.lang[lang]['button_next'] ? this.lang[lang]['button_next'] : 'weiter';
		const formwrapper = this.formWrapper(wrapper, s);

		/**
		 * create list of courses
		 */
		const formList = this.bookingFormList(lang);
		formwrapper.querySelector('.vabsform__body').append(formList);

		/**
		 * append courses to list
		 */
		this.appendListItems(formList.querySelector('.element__body'), elem, wrapper);

		/**
		 * create user form
		 */
		formwrapper.querySelector('.vabsform__body').append(this.userform(wrapper, lang));

		/**
		 * init flatpickr
		 */
		this.flatPickr(formwrapper);

		/**
		 * append Interests to select field
		 */
		this.appendInterest(formwrapper);

		/**
		 * create confirmation part
		 */
		formwrapper.querySelector('.vabsform__body').append(this.formConfirmation(lang));

		/**
		 * add confirmation change links
		 */
		formwrapper.querySelectorAll('.confirmation .link').forEach((link) => {
			link.addEventListener('click', (e) => {
				const cl = e.target.dataset.target;
				const el = '.vabsform__body--element.' + cl + ' .element__body';

				formwrapper.querySelectorAll('.element__body').forEach((element) => {
					element.style.height = '0px';
				});

				formwrapper.querySelector(el).style.height = formwrapper.querySelector(el).scrollHeight + 'px';
				formwrapper.querySelector('button .text').innerHTML = 'weiter';
				wrapper.current = cl;
			});
		});

		/**
		 * append created formwrapper to each given element
		 */
		elem.append(formwrapper);
		elem.querySelector('button .loading').style.display = 'none';
	}


	/**
	 * functions to create and append different Elements
	 */

	/**
	 *
	 * @param wrapper
	 * @param string
	 * @returns {Element}
	 */
	formWrapper(wrapper, string) {
		const form = document.createElement('form');
		form.className = 'vabsform';
		form.autocomplete = 'off';
		let html = '<div class="vabsform__body"></div>';
		html += `<div class="vabsform__footer"><button class="vabsformsubmit"><span class="text">${ string }</span><span class="loading"></span></button></div>`;
		form.innerHTML = html;

		form.addEventListener('reset', () => {
			wrapper.reset(form);
		});

		form.querySelector('button.vabsformsubmit').addEventListener('click', (e) => {
			e.preventDefault();
			wrapper.submit(e, form);
		});
		return form;
	}


	flatPickr(elem) {
		const anreiseElem = elem.querySelector('input[name="anreise"]');
		const abreiseElem = elem.querySelector('input[name="abreise"]');
		flatpickr(anreiseElem, {
			locale: {
				firstDayOfWeek: 1,
				weekdays: {
					shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
					longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
				},
				months: {
					shorthand: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
					longhand: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
				}
			},
			minDate: new Date(),
			altInput: true,
			dateFormat: "Y-m-d",
			altFormat: "d.m.Y",
			plugins: [new rangePlugin({input: abreiseElem})],
		});


		flatpickr(abreiseElem, {
			locale: {
				firstDayOfWeek: 1,
				weekdays: {
					shorthand: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
					longhand: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
				},
				months: {
					shorthand: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
					longhand: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
				}
			},
			minDate: new Date(),
			altInput: true,
			dateFormat: "Y-m-d",
			altFormat: "d.m.Y",
			plugins: [new rangePlugin({input: abreiseElem})],
		});
	}

	/**
	 *
	 * @returns {Element}
	 */
	bookingFormList(lang) {
		const div = document.createElement('div');
		div.className = 'vabsform__body--element';
		div.classList.add('course');
		let html = '<div class="element">';
		html += `<div class="element__header"><span class="element__header--index"></span>${ this.lang[lang]['title_course'] ? this.lang[lang]['title_course'] : 'wähle deinen Kurs' }</div>`;
		html += '<div class="element__body"></div>';
		html += '</div>';

		div.innerHTML = html;
		return div;
	}

	/**
	 *
	 * @param element
	 * @param el
	 * @param wrapper
	 */
	appendListItems(element, el, wrapper) {
		if (el.dataset.type === 'group') {
			/**
			 * query elements given by group id
			 */

			let group = this.fetchData('get_courses_of_group', {id: el.dataset.query});
			group.then((items) => {
				items.forEach((item) => {
					this.listItem(wrapper, element, item);
					wrapper.addCourse(item);
				})
			})

		} else if (el.dataset.type === 'course') {
			/**
			 * get elements from given ids
			 * @type {*|Array}
			 */
			const ids = el.dataset.query.split(',');
			ids.forEach((id) => {
				let item = this.fetchData('get_single_course', {id: id});

				item.then((response) => {
					this.listItem(wrapper, element, response[0]);
					wrapper.addCourse(response[0]);
				});
			});
		}

	}


	/**
	 *
	 * @param form
	 */
	appendInterest(form) {
		const interests = this.fetchData('get_client_interest');

		interests.then((response) => {
			response.forEach((item) => {
				const option = document.createElement('option');
				option.value = item.checkbox_title;
				option.innerHTML = item.checkbox_title;

				form.querySelector('select[name="interest"]').append(option);
			})
		});
	}

	/**
	 *
	 * @param wrapper
	 * @param elem
	 * @param item
	 */
	listItem(wrapper, elem, item) {

		const priceData = this.fetchData('get_course_details', {id: item.id, qty: item.minBookableAmount});
		priceData.then((data) => {
			/**
			 * update price list on form object
			 * @type {Element}
			 */
			wrapper.addPrice(item, data);

			/**
			 * create element with events
			 * @type {Element}
			 */
			const div = document.createElement('div');
			div.className = 'course';
			let html = '';
			if (item.unit_shortcode === 'h') {
				html += '<span class="course__desc"><label style="display: block;"><input type="checkbox" name="course" value="' + item.id + '"> ' + item.name + '</label>' + item.kurz_beschreibung.replace('<br />', '') + '</span><span class="course__qty">' + item.anzTage + ' Tag(e) á <input type="number" name="courseqty" data-course="' + item.id + '" min="' + parseInt(item.minBookableAmount) + '" value="' + item.minBookableAmount + '"> Stunde(n)</span><span class="course__price">' + parseFloat(data.price).toFixed(2) + ' €</span>';
			} else if (item.unit_shortcode === 'd') {
				html += '<span class="course__desc"><label style="display: block;"><input type="checkbox" name="course" value="' + item.id + '"> ' + item.name + '</label>' + item.kurz_beschreibung.replace('<br />', '') + '</span><span class="course__qty"><input type="number" name="courseqty" data-course="' + item.id + '" min="' + parseInt(item.minBookableAmount) + '" value="' + item.minBookableAmount + '">Tag(e) á ' + item.anzStunden + ' Stunde(n)</span><span class="course__price">' + parseFloat(data.price).toFixed(2) + ' €</span>';
			} else if (item.unit_shortcode === 'w') {
				html += '<span class="course__desc"><label style="display: block;"><input type="checkbox" name="course" value="' + item.id + '"> ' + item.name + '</label>' + item.kurz_beschreibung.replace('<br />', '') + '</span><span class="course__qty"><input type="number" name="courseqty" data-course="' + item.id + '" min="' + parseInt(item.minBookableAmount) + '" value="' + item.minBookableAmount + '">Woche(n)</span><span class="course__price">' + parseFloat(data.price).toFixed(2) + ' €</span>';
			}
			div.innerHTML = html;

			div.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
				wrapper.updateCourseList(e)
			});

			div.querySelector('input[name="courseqty"]').addEventListener('change', (e) => {
				wrapper.updateCourseQty(e)
			});

			elem.append(div)
		}).then(() => {
			elem.style.height = elem.scrollHeight + 'px';
		});

	}

	/**
	 *
	 * @param wrapper
	 * @returns {Element}
	 */
	userform(wrapper, lang, show = false) {

		const div = document.createElement('div');
		div.className = 'vabsform__body--element';
		div.classList.add('user');

		let html = '<div class="element">';
		html += `<div class="element__header"><span class="element__header--index"></span>${ this.lang[lang]['title_persdata'] ? this.lang[lang]['title_persdata'] : 'Fülle deine persönlichen Daten aus' }</div>`;
		html += '<div class="element__body"><div class="form">';
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">${ this.lang[lang]['form_label_firstname'] ? this.lang[lang]['form_label_firstname'] : 'Vorname' }</label><input type="text" name="firstname" autocomplete="of"></div><div class="form__field"><label style="display: block;">${ this.lang[lang]['form_label_lastname'] ? this.lang[lang]['form_label_lastname'] : 'Vorname' }</label><input type="text" name="lastname" autocomplete="off"></div></div>`;
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">${ this.lang[lang]['form_label_mobile'] ? this.lang[lang]['form_label_mobile'] : 'Telefonnummer' }</label><input type="text" name="mobile" autocomplete="off"></div><div class="form__field"><label style="display: block;">${ this.lang[lang]['form_label_email'] ? this.lang[lang]['form_label_email'] : 'Emailadresse' }</label><input type="text" name="email" autocomplete="off"></div></div>`;
		html += `<div class="form__field horizontal"><div class="form__field"><label style="display: block;">${ this.lang[lang]['form_label_datefrom'] ? this.lang[lang]['form_label_datefrom'] : 'Tag der Anreise' }</label><input type="text" name="anreise" class="vabsTravleDetails vabsTravleDetailsArrival"></div><div class="form__field"><label style="display: block;">${ this.lang[lang]['form_label_dateto'] ? this.lang[lang]['form_label_dateto'] : 'Tag der Abreise' }</label><input type="text" name="abreise" class="vabsTravleDetails vabsTravleDetailsDeparture"></div></div>`;
		html += `<div class="form__field"><label style="display: block;">${ this.lang[lang]['form_label_interest'] ? this.lang[lang]['form_label_interest'] : 'Interesse' }</label><select name="interest"><option disbaled selected>${ this.lang[lang]['form_label_intereset_inner'] ? this.lang[lang]['form_label_intereset_inner'] : 'Interesse wählen' }</option></select></div>`;
		html += `<div class="form__field"><label style="display: block;">${ this.lang[lang]['form_label_note'] ? this.lang[lang]['form_label_note'] : 'Bemerkung' }</label><textarea name="note" rows="10"></textarea></div>`;
		html += `<div class="form__field"><label><input type="checkbox">${ this.lang[lang]['cart_disclaimer_text'] ? this.lang[lang]['cart_disclaimer_text'] : 'Mit Absenden dieser Buchung stimmen Sie unserer Datenschutzbestimmung zu.' }</label></div>`;
		html += '</div></div>';
		html += '</div>';

		div.innerHTML = html;
		div.querySelector('.element__body').style.height = show ? 'auto' : '0px';

		div.querySelector('select[name="interest"]').addEventListener('change', (e) => {
			e.preventDefault();
			wrapper.updateUser(e);
		});

		div.querySelector('textarea').addEventListener('change', (e) => {
			e.preventDefault();
			wrapper.updateUser(e);
		});

		div.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
			wrapper.updateDSGVO(e);
		});

		div.querySelectorAll('input[type="text"]').forEach((input) => {
			input.addEventListener('change', (e) => {
				e.preventDefault();
				wrapper.updateUser(e);
			})
		});

		return div;
	}


	/**
	 *
	 * @returns {Element}
	 */
	formConfirmation(lang) {
		const div = document.createElement('div');
		div.className = 'vabsform__body--element';
		div.classList.add('confirmation');

		let html = '<div class="element">';
		html += `<div class="element__header"><span class="element__header--index"></span>${ this.lang[lang]['title_confirmation'] ? this.lang[lang]['title_confirmation'] : 'Bitte überprüfe deine Daten auf Richtigkeit' }</div>`;
		html += '<div class="element__body">';
		html += '<div class="confirmation">';
		html += '<div class="confirmation__user"><p><span>Persönliche Daten</span><span class="link" data-target="user">Daten ändern</span></p><span class="name"></span><span class="mobile"></span><span class="email"></span><span class="note"></span></div>';
		html += '<div class="confirmation__travel"><p><span>Reisedaten</span><span class="link" data-target="user">Daten ändern</span></p><span class="arrival"></span> - <span class="departure"></span></div>';
		html += '<div class="confirmation__course"><p><span>Kursdaten</span><span class="link" data-target="course">Daten ändern</span></p></div>';
		html += '<div class="confirmation__payment"><p>Gesamtbetrag</p><span class="totalprice"></span></div>';
		html += '</div>';
		html += '</div>';
		html += '</div>';

		div.innerHTML = html;
		div.querySelector('.element__body').style.height = '0px';

		return div;
	}

	/**
	 *
	 * @param method
	 * @param data
	 * @returns {Q.Promise<any> | * | Promise.<TResult> | Q.Promise<never | T>}
	 */
	fetchData(method, data = {}) {
		return fetch(this.url + '?method=' + method, {
			method: 'POST',
			body: JSON.stringify(data)
		}).then((response) => {
			return response.json();
		});
	}
}