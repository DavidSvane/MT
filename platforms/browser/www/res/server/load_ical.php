<?php

  require 'ical_parser.php';

  $raw = file_get_contents('https://calendar.google.com/calendar/ical/44ag8bkqmrp1me2ik7mh9uo5c4%40group.calendar.google.com/public/basic.ics');
  file_put_contents('mt.ics', $raw);
  $ical = new ical('mt.ics');
  $events = $ical->events();

  echo(json_encode($events));

?>
