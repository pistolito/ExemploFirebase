

// Initialize Firebase
var config = {
	apiKey: "AIzaSyC-R2siytHwWRerRFRYggRnmZg9qaFJBLA",
	authDomain: "aula-76cea.firebaseapp.com",
	databaseURL: "https://aula-76cea.firebaseio.com",
	projectId: "aula-76cea",
	storageBucket: "aula-76cea.appspot.com",
	messagingSenderId: "230439922933",
};



firebase.initializeApp(config);

// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const notificacaoRef = dbRef.child('notificacao');


readUserData();


// --------------------------
// READ
// --------------------------
function readUserData() {

	const userListUI = document.getElementById("listaNotificacao");

	notificacaoRef.on("value", snap => {

		userListUI.innerHTML = ""

		snap.forEach(childSnap => {

			let key = childSnap.key,
				value = childSnap.val()

			let $li = document.createElement("li");

			// edit icon
			let editIconUI = document.createElement("button");
			document.createElement("p");
			editIconUI.class = "editarNotificacao";
			editIconUI.innerHTML = " ✎";
			editIconUI.setAttribute("idNotificacao", key);
			editIconUI.addEventListener("click", botaoEditarClicado)

			// delete icon
			let deleteIconUI = document.createElement("button");
			deleteIconUI.class = "deletarNotificacao";
			deleteIconUI.innerHTML = "  ☓";
			deleteIconUI.setAttribute("idNotificacao", key);
			deleteIconUI.addEventListener("click", deletarNotificacaoClicado)

			$li.innerHTML = value.titulo;
			$li.append(editIconUI);
			$li.append(deleteIconUI);

			$li.setAttribute("chaveNotificacao", key);
			$li.addEventListener("click", clickNotificacao)
			userListUI.append($li);

		});


	})

}



function clickNotificacao(e) {


	var idNotificacao = e.target.getAttribute("chaveNotificacao");

	const userRef = dbRef.child('notificacao/' + idNotificacao);
	const userDetailUI = document.getElementById("detalhesNotificacao");

	userRef.on("value", snap => {

		userDetailUI.innerHTML = ""

		snap.forEach(childSnap => {
			var $p = document.createElement("p");
			$p.innerHTML = childSnap.key + " - " + childSnap.val();
			userDetailUI.append($p);
		})

	});

}



//adicionar
const addUserBtnUI = document.getElementById("addNotificacao");
addUserBtnUI.addEventListener("click", saveNotificacao)



function saveNotificacao() {

	const notificacaoRef = dbRef.child('notificacao');

	const addUserInputsUI = document.getElementsByClassName("user-input");

	let newUser = {};

	for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

		let key = addUserInputsUI[i].getAttribute('data-key');
		let value = addUserInputsUI[i].value;
		newUser[key] = value;
	}

	notificacaoRef.push(newUser)


}


//deletar
function deletarNotificacaoClicado(e) {

	e.stopPropagation();

	var idNotificacao = e.target.getAttribute("idNotificacao");

	const userRef = dbRef.child('notificacao/' + idNotificacao);

	userRef.remove();

}


//editar
function botaoEditarClicado(e) {

	document.querySelector(".editarNotificacao").value = e.target.getAttribute("idNotificacao");

	const userRef = dbRef.child('notificacao/' + e.target.getAttribute("idNotificacao"));

	const editUserInputsUI = document.querySelectorAll(".edit-user-input");


	userRef.on("value", snap => {

		for (var i = 0, len = editUserInputsUI.length; i < len; i++) {

			var key = editUserInputsUI[i].getAttribute("data-key");
			editUserInputsUI[i].value = snap.val()[key];
		}

	});




	const saveBtn = document.querySelector("#enditarBtn");
	saveBtn.addEventListener("click", saveUserBtnClicked)
}


function saveUserBtnClicked(e) {

	const idNotificacao = document.querySelector(".editarNotificacao").value;
	const userRef = dbRef.child('notificacao/' + idNotificacao);

	var editedUserObject = {}

	const editUserInputsUI = document.querySelectorAll(".edit-user-input");

	editUserInputsUI.forEach(function (textField) {
		let key = textField.getAttribute("data-key");
		let value = textField.value;
		editedUserObject[textField.getAttribute("data-key")] = textField.value
	});



	userRef.update(editedUserObject);


}
