CREATE MIGRATION m1n5k4x5uu6fqonafwvtao33tdp35qtwvtxqwpvz5w4udgq6eamyla
    ONTO m1gxsl5wbx4bzhglg5v46sqgso54gjio5s54vl7gkdg3fhbrquhbaq
{
  ALTER TYPE default::Movie {
      CREATE PROPERTY likes -> std::int32;
  };
};
