var win = window,
	doc = document;

var MGD = {
	ItemJSON: 'resources/json/itemData.json',

	init: function () {
		MGD.List.listItems = MGD.Loader.loadJSON(MGD.ItemJSON, MGD.List.showItems);
		MGD.ButtonBar.init();
	}
};

// get Data, here from json file
MGD.Loader = {
	loadJSON: function (url, callback) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				//callback(this);
				callback(JSON.parse(this.responseText));
			} else {
				// jsonDataFallback
				console.log(this.readyState + " / " + this.status);
			}
		};

		xhttp.overrideMimeType("application/json");
		xhttp.open("GET", url, true);
		xhttp.send();
	}
};

MGD.Item = {
	baseNode: ['<div class="item-inner">',
			   '<div class="item-image" style="background-image: url({image});"></div>',
			   '<div class="item-header">',
			   '<span class="item-header-text">{name}</span>',
			   '<span class="item-header-badge {typeStyle}">{type}</span>',
			   '</div>',
			   '<div class="item-body">{text}</div>',
			   '<button class="item-button-moreInfo">Mehr erfahren</button>',
			   '</div>'].join(''),

	createItem: function (item) {
		var nodeString = this.baseNode,
			colorObj = { G: 'green', O: 'yellow', F: 'red' },
			cls = colorObj[item.type.toUpperCase().substring(0, 1)] || 'green';

		// templating
		nodeString = nodeString.replace('{image}', item.image);
		nodeString = nodeString.replace('{name}', item.name);
		nodeString = nodeString.replace('{typeStyle}', cls);
		nodeString = nodeString.replace('{type}', item.type);
		nodeString = nodeString.replace('{text}', item.text);

		var el = doc.createElement('div');
		el.className = 'item ' + cls;
		el.innerHTML = nodeString;
		return el;
	},

	createItemNode: function (itemArray) {
		var docfrag = doc.createDocumentFragment();

		itemArray.forEach((item) => docfrag.appendChild(this.createItem(item)));

		return docfrag;
	},

	addItems: function (itemArray) {
		var itemNode = doc.getElementById('itemList');

		itemNode.appendChild(this.createItemNode(itemArray));
	}
};

MGD.List = {
	showItems: function (itemObj) {
		MGD.Item.addItems(itemObj.items);
	}
};

MGD.ButtonBar = {
	init: function () {
		var btns = Array.prototype.slice.call(doc.getElementsByClassName('quick-filter'));

		btns.forEach(function (btn) { btn.addEventListener('click', MGD.ButtonBar.btnCallback) });
	},

	btnCallback: function (event) {
		var btn = event.target,
			cls = btn.getAttribute('data-filter-type');

		doc.getElementsByClassName('item-container')[0].classList.toggle(cls);
		btn.classList.toggle('is-active');
	}
};

document.addEventListener('DOMContentLoaded', MGD.init, false);