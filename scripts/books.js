
const kinveyAppID = "kid_HJBdNBYS";
const kinveyAppSecred = "5616762d5a474b49a12e024f9d12054c";
const kinveyServiceBaseUrl = "https://baas.kinvey.com/";


function showView(viewId) {
    $("main > section").hide();
    $("#" + viewId).show();
}

function showHideNavigationLinks() {
    let loggedIn = sessionStorage.authToken != null;
    if(loggedIn){
        $("#linkHome").show();
        $("#linkLogin").hide();
        $("#linkRegister").hide();
        $("#linkListBooks").show();
        $("#linkCreateBook").show();
        $("#linkLogout").show();
    }else{
        $("#linkHome").show();
        $("#linkLogin").show();
        $("#linkRegister").show();
        $("#linkListBooks").hide();
        $("#linkCreateBook").hide();
        $("#linkLogout").hide(); 
    }
}

function showHomeView() {
    showView('viewHome');
}

function showLoginView() {
    showView('viewLogin');
}

function login() {
    let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/login";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppSecred)};
    let loginData = {
        username: $("#loginUser").val(),
        password: $("#loginPass").val()
    };
    $.ajax({
        method: "POST",
        url: loginUrl,
        data: loginData,
        headers: kinveyAuthHeaders,
        success: loginSuccess,
        error: showAjaxError
    });
    function loginSuccess(data, status) {
        sessionStorage.authToken = data._kmd.authToken;
        showListBooksView();
        showHideNavigationLinks();
        showInfo("Login successful")
    }
}

function showInfo(messageText){
    $('#infoBox').test(messageText).show().delay(3000).fadeOut();
}

function showAjaxError(data, status) {
    let errorMsg = "Error: " + JSON.stringify(data);
    $('#errorBox').text(errorMsg).show();
}

function showRegisterView() {
    showView('viewRegister');
}

function register() {

    let loginUrl = kinveyServiceBaseUrl + "user/" + kinveyAppID + "/";
    let kinveyAuthHeaders = {'Authorization': "Basic " + btoa(kinveyAppID + ":" + kinveyAppSecred)};
    let loginData = {
        username: $("#registerUser").val(),
        password: $("#registerPassword").val()
    };
    $.ajax({
        method: "POST",
        url: loginUrl,
        data: loginData,
        headers: kinveyAuthHeaders,
        success: registerSuccess,
        error: showAjaxError
    });
    function registerSuccess(data, status) {
        sessionStorage.authToken = data._kmd.authtoken;
        showListBooksView();
        showHideNavigationLinks();
        showInfo("Register successful")
    }
}

function showListBooksView() {
    showView('viewBooks');
    $('#books').text('');

    let booksUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/books";
    let kinveyAuthHeaders = {'Authorization': "Kinvey " + sessionStorage.authToken};
    $.ajax({
        method: "GET",
        url: booksUrl,
        headers: kinveyAuthHeaders,
        success: booksLoaded,
        error: showAjaxError
    });
    function booksLoaded(data, status) {
        showInfo("Books loaded");
        let booksTable = $('<table>')
            .append($('<tr>')
                .append($('<th>Title</th>'))
                .append($('<th>Author</th>'))
                .append($('<th>Description</th>'))
            );
        for(let book of data){
            booksTable.append($('<tr>')
                    .append($('<td></td>').text(book.title))
                    .append($('<td></td>').text(book.author))
                    .append($('<td></td>').text(book.description))
                );
        }
        $('#books').append(booksTable);
    }
}

function showCreateBookView() {
    showView('viewCreateBook');
}

function createBook() {

    let booksUrl = kinveyServiceBaseUrl + "appdata/" + kinveyAppID + "/books";
    let kinveyAuthHeaders = {'Authorization': "Kinvey " + sessionStorage.authToken,
                             "Content-type": "application/json"};
    let newBookData = {
        title: $('#bookTitle').val(),
        author: $('#bookAuthor').val(),
        description: $('#bookDescription').val()
    };
    $.ajax({
        method: "GET",
        url: booksUrl,
        data: JSON.stringify(newBookData),
        headers: kinveyAuthHeaders,
        success: bookCreated,
        error: showAjaxError
    });
    function bookCreated(data) {
        showListBooksView();
        showInfo("Book created.")
    }
}

function logout() {
    sessionStorage.clear();
    showHomeView();
    showHideNavigationLinks();
}

$(function () {
    $("#linkHome").click(showHomeView);
    $("#linkLogin").click(showLoginView);
    $("#linkRegister").click(showRegisterView);
    $("#linkListBooks").click(showListBooksView);
    $("#linkCreateBook").click(showCreateBookView);
    $("#linkLogout").click(logout);
    
    $("#loginForm").submit(login);
    $("#formRegister").submit(register);
    $("#formCreateBook").submit(createBook);

    showHomeView();
    showHideNavigationLinks();

    $(document)
        .ajaxStart(function() {
            $('#loadingBox').show();
        })
        .ajaxStop(function() {
            $('#loadingBox').hide();
        });
});



