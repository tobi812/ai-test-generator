module default {
  type Person {
    required property name -> str;
  }

  type Movie {
    property title -> str;
    property likes -> int64;
    multi link actors -> Person;
  }
}
