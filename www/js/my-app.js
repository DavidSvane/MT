var myApp = new Framework7();
var $$ = Dom7;
var mainView = myApp.addView('.view-main');


// LOGIN LOGICS
function accessGranted() {
  $('.navbar-inner .right').show();
  $('#main_menu').show();
  $('#login_screen').hide();
  $('#p_index').css("display", "grid");
}
if (localStorage.getItem('access') == 'granted') {
  accessGranted();
}
if (document.cookie.length > 0) {
  var coo = document.cookie.split(';');
  if (coo.includes('access=granted')) {
    accessGranted();
  }
}
function typeNumber(n) {
  $('#pass_fill').hide();
  $('#pass_field').css('display', 'flex');

  if ($('#pass_field').val().length < 1) {
    $('#pass_fill').val("");
  }
  $('#pass_fill').val( $('#pass_fill').val() + n );
  $('#pass_field').val( $('#pass_field').val() + "*" );

  if ($('#pass_fill').val() == "250") {
    $('#pass_fill').val("");
    $('#pass_field').val("");
    accessGranted()

    localStorage.setItem('access','granted');
    document.cookie = "access=granted; expires=Tue, 01 Jan 2030 12:00:00 UTC; path=/";
  } else if ($('#pass_fill').val().length > 2) {
    $('#pass_fill').val("Forkert kode");
    $('#pass_field').val("");
    $('#pass_field').hide();
    $('#pass_fill').css('display', 'flex');
  }
}


// PAGE LOGICS
function openIAB(url) {
  $$.post('http://davidsvane.com/mt/f/', {f: url}, function() {});

  //window.open = cordova.InAppBrowser.open;
  //window.open(url,'_system','location=no');
  //delete window.open;
}
myApp.onPageInit('contacts', function(page) {
  $$.post('http://davidsvane.com/mt/load_contacts.php', {request: 'contacts'}, function (d) {
    var obj = JSON.parse(d);
    var keys = Object.keys(obj);

    for (var i = 0; i < keys.length; i++) {
      var cnt = '<tr><td><a onclick="window.open(\'mailto:' + obj[i+1]['mail'] + '\', \'_system\')" data-rel="external">' + obj[i+1]['name'] + '</a></td><td>' + obj[i+1]['function'] + '</td><td>';
      if (obj[i+1]['phone'] != '') {
        cnt += '<a onclick="window.open(\'tel:' + obj[i+1]['phone'] + '\', \'_system\')" data-rel="external"><img src="res/icon_contacts_orange.png"/></a>';
      }
      cnt += '</td><td>';
      if (obj[i+1]['snap'] != '') {
        cnt += '<a onclick="window.open(\'https://www.snapchat.com/add/' + obj[i+1]['snap'] + '\', \'_system\')" data-rel="external"><img src="res/snap.png"/></a>';
      }
      cnt += '</td></tr>';

      $('#p_contacts table tbody').append(cnt);
    }
  });
});


// CALENDAR LOGICS
myApp.onPageInit('calendar', function(page) {
  for (var i = 0; i < 42; i++) {
    $('#c_container').append('<a class="c_dates" id="c_d_' + i + '"></a>');
  }

  var d = new Date();
  var y_now = d.getFullYear();
  var m_now = d.getMonth();
  var d_now = d.getDate();
  fillCalendar(y_now, m_now);
});
function bolditalic(t) {
  t=t.replace(/\(\(\(/g, "<span>");
  t=t.replace(/\)\)\)/g, "</span>");
  t=t.replace(/\(\(/g, "<i>");
  t=t.replace(/\)\)/g, "</i>");
  t=t.replace(/\(/g, "<b>");
  t=t.replace(/\)/g, "</b>");
  t=t.replace(/\/\//g, "<br />");
  return t;
}
function fillCalendar(y, m) {
  var ms = ["Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December"];
  var dim = [31,28,31,30,31,30,31,31,30,31,30,31];
  var d = new Date(y, m);
  var wd = (d.getDay() + 6) % 7;
  var l = (y%4==0 && y%100!=0) || (y%400==0);

  for (var i = 0; i < 42; i++) {
    $('#c_d_'+i).text("");
  }
  $('.agenda').removeClass('agenda');
  $('.e_active').removeClass('e_active');

  $('#c_month').text(ms[m] + " " + y);
  $('#c_m_n').text(m%12);
  $('#c_y_n').text(y);
  for (var i = wd; i < dim[m]+wd; i++) {
    $('#c_d_'+i).text(i-wd+1);
  }
  $('.c_events').remove();

  $$.post('http://davidsvane.com/mt/rehearsal/rehearsal_get.php', {year: y, month: m+1}, function(d) {

    if (d.length < 42) { return; }
    var obj = JSON.parse(d);
    var days = Object.keys(obj);

    console.log(obj);

    for (var day = 0; day < days.length; day++) {

      $('.c_dates:contains('+days[day]+')').first().addClass('agenda');
      $('.c_dates:contains('+days[day]+')').first().attr("href", "javascript:showDetails("+days[day]+")");

      $('#p_calendar').append('<div class="c_events" id="e_'+days[day]+'"></div>');

      for (var des = 0; des < obj[days[day]]['descriptions'].length-1; des++) {
        var description = bolditalic(decodeURI(obj[days[day]]['descriptions'][des]));
        var title = bolditalic(decodeURI(obj[days[day]]['titles'][des]));
        $('#e_'+days[day]).append('<div class="description"><span>'+bolditalic(decodeURI(title))+'</span><span>'+bolditalic(decodeURI(description))+'</span></div>');
      }

      $('#e_'+days[day]).append('<div class="startstop">Tidspunkt: '+bolditalic(decodeURI(obj[days[day]]['start']))+' - '+bolditalic(decodeURI(obj[days[day]]['stop']))+'</div>');
      $('#e_'+days[day]).append('<div class="teacher"><span>Prøve med:</span><span>'+bolditalic(decodeURI(obj[days[day]]['leader']))+'</span></div>');
      $('#e_'+days[day]).append('<div class="doorsopen"><span>Dørene åbner:</span><span>'+bolditalic(decodeURI(obj[days[day]]['doors']))+'</span></div>');
      $('#e_'+days[day]).append('<div class="dressing"><span>Dresscode:</span><span>'+bolditalic(decodeURI(obj[days[day]]['dress']))+'</span></div>');
      $('#e_'+days[day]).append('<div class="luggage"><span>Medbring:</span><span>'+bolditalic(decodeURI(obj[days[day]]['bring']))+'</span></div>');
      $('#e_'+days[day]).append('<div class="preparation"><span>Forberedelse:</span><span>'+bolditalic(decodeURI(obj[days[day]]['prep']))+'</span></div>');
      $('#e_'+days[day]).append('<div class="adresse">'+bolditalic(decodeURI(obj[days[day]]['place']))+'</div>');

    }

  });
}
function changeMonth(n) {
  var y = parseInt( $('#c_y_n').text() );
  var m = parseInt( $('#c_m_n').text() ) +n;
  if (m > 11) {
    y += n;
    m %= 12;
  } if (m < 0) {
    y += n;
    m += 12;
  }
  fillCalendar(y, m);
}
function showDetails(n) {
  $('.e_active').removeClass('e_active');
  $('.c_dates:contains('+n+')').first().addClass('e_active');
  $('.c_events').hide();
  $('#e_'+n).show();
}


// TICKET PAGE LOGICS
myApp.onPageInit('tickets', function(page) {
  for (var i = 0; i < 264; i++) {
    if ( i < 72 ) {
      $('#p_tickets #t_seats').append('<div class="grpB"></div>');
    } else if ( $.inArray(i, [72,73,94,95,96,97,118,119,120,121,142,143,144,145,166,167,168,169]) != -1 ) {
      $('#p_tickets #t_seats').append('<div class="grpC"></div>');
    } else if ( $.inArray(i, [189,190,193,194,212,213,218,219,235,236,243,244,258,259]) != -1 ) {
      $('#p_tickets #t_seats').append('<div class="grpD"></div>');
    } else if ( $.inArray(i, [191,192,214,215,216,217,237,238,239,240,241,242,260,261,262,263]) != -1 ) {
      $('#p_tickets #t_seats').append('<div></div>');
    } else {
      $('#p_tickets #t_seats').append('<div class="grpA"></div>');
    }
  }
  $('#p_tickets #t_seats').append('<div id="t_scene">SCENE</div>');
});
function addTicket(grp) {
  var grps = { A:199, B:189, C:149, D:129 };
  $('#t_price').html( parseInt($('#t_price').html())+grps[grp] );
  $('#t_a_' + grp).html( parseInt($('#t_a_' + grp).html())+1 );
  $('#t_empty').hide();
  $('#t_betal').show();

  var description = "";
  if ( $('#t_a_A').html() != "0" ) { description += $('#t_a_A').html() + "x A, "; }
  if ( $('#t_a_B').html() != "0" ) { description += $('#t_a_B').html() + "x B, "; }
  if ( $('#t_a_C').html() != "0" ) { description += $('#t_a_C').html() + "x C, "; }
  if ( $('#t_a_D').html() != "0" ) { description += $('#t_a_D').html() + "x D, "; }
  description = description.substr(0, description.length-2);

  $('#t_basket').html( description );
  $('#t_betal').attr( 'onclick', 'window.open("https://www.mobilepay.dk/erhverv/betalingslink/betalingslink-svar?phone=26616&amount=' + $('#t_price').text() + '&comment=Jack ' + $('#t_basket').text() + '&lock=1", "_system")' );
}
function resetTickets() {
  $('#t_price').html(0);
  $('#t_a_A').html(0);
  $('#t_a_B').html(0);
  $('#t_a_C').html(0);
  $('#t_a_D').html(0);
  $('#t_basket').html('Intet valgt!');
  $('#t_betal').hide();
  $('#t_empty').show();
}


// SNACK PAGE LOGICS
function checkSnack() {
  $('#s_betal').toggle( parseInt( $('#s_pris').html() ) != 0 );
  $('#s_none').toggle( parseInt( $('#s_pris').html() ) == 0 );

  $('#s_betal').attr( 'onclick', 'window.open("https://www.mobilepay.dk/erhverv/betalingslink/betalingslink-svar?phone=26616&amount=' + $('#s_pris').text() + '&comment=MTsnacks&lock=1", "_system")' );
}
function addSnack(amount) {
  $('#s_pris').html( parseInt( $('#s_pris').html() ) + amount ); checkSnack();
}
function resetSnack() {
  $('#s_pris').html( 0 ); checkSnack();
}
function removeSnack() {
  $('#s_pris').html( parseInt( $('#s_pris').html() ) - 5 );
  if (parseInt( $('#s_pris').html() ) < 0) { $('#s_pris').html( 0 ); }
  checkSnack();
}


// NAVBAR CHANGES
$$(document).on('pageInit', function (e) {
  $('.navbar .left').html('<a href="#" class="back link"><i class="icon icon-back"></i></a>');
  $('.navbar .left a').click(function() {
    $('.navbar .left').html('&nbsp;&nbsp;&nbsp;&nbsp;MusicalTeatret');
  });
});
