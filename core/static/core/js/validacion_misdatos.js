$(document).ready(function() {

  // Agregar método de validación para RUT chileno
  $.validator.addMethod("rutChileno", function(value, element) {

    // Validar que el RUT tenga el formato correcto (8 o 9 dígitos + guión + dígito verificador)
    var rutPattern = /^\d{7,8}-[\dK]$/;
    if (!rutPattern.test(value)) {
        return false;
    }

    // Validar el dígito verificador
    var rutSinGuion = value.replace("-", "");
    var rut = rutSinGuion.slice(0, -1);
    var dv = rutSinGuion.slice(-1);
    var factor = 2;
    var sum = 0;
    for (var i = rut.length - 1; i >= 0; i--) {
        sum += parseInt(rut.charAt(i)) * factor;
        factor = factor === 7 ? 2 : factor + 1;
    }
    var dvCalculado = 11 - (sum % 11);
    dvCalculado = dvCalculado === 11 ? "0" : dvCalculado === 10 ? "K" : dvCalculado.toString();

    return dv === dvCalculado;
  }, "El RUT no es válido (escriba sin puntos y con guión)");

  
  // Agregar método de validación para correo
  $.validator.addMethod("emailCompleto", function(value, element) {

    // Expresión regular para validar correo electrónico
    var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z\-0-9]{2,}))$/;

    // Validar correo electrónico con la expresión regular
    return regex.test(value);

  }, 'El formato del correo no es válido');
  
    // Agregar método de validación para que un campo sólo acepte 
  // letras y espacios en blanco, pero no números ni símbolos,
  // ideal para campos como nombres y apellidos
  $.validator.addMethod("soloLetras", function(value, element) {

    return this.optional(element) || /^[a-zA-Z\s]*$/.test(value);

  }, "Sólo se permiten letras y espacios en blanco.");

    // El siguiente Javascript obliga a que la caja de texto del rut, siempre escriba la letra "K" en mayúscula
     document.getElementById('rut').addEventListener('keyup', function(e) {
       e.target.value = e.target.value.toUpperCase();
     });

  // Asignar placeholders para ayudar a los usuarios
  $('#id_username').attr('placeholder', 'Ej: cgomezv, cevans, sjohasson');
  $('#id_first_name').attr('placeholder', 'Ej: Cristián, Chris, Scarlett');
  $('#id_last_name').attr('placeholder', 'Ej: Gómez Vega, Evans, Johansson');
  $('#id_email').attr('placeholder', 'Ej: cevans@marvels.com');
  $('#id_rut').attr('placeholder', 'Ej: 11111111-1 (sin puntos y con guión)');
  $('#id_direccion').attr('placeholder', 'Calle, n° casa o edificio, n° departamento o piso\n'
    + 'localidad o ciudad, código postal o de área\n'
    + 'estado o provincia, ciudad, país');

  // Agregar una validación por defecto para que la imagen la exija como campo obligatorio
  $.extend($.validator.messages, {
    required: "Este campo es requerido",
  });     
  

  // Validar formulario de registro
  $('#form').validate(
    {
      rules: {
        'username': {
          required: true,
        },        
        'rut': {
          required: true,
          rutChileno: true
        },
        'first_name': {
          required: true,
          soloLetras: true,
          minlength: 3,
          maxlength: 50
        },
        'last_name': {
          required: true,
          soloLetras: true,
          minlength: 3,
          maxlength: 50
        },
        'email': {
          required: true,
          emailCompleto: true,
          email: true
        },
        'direccion': {
          required: true,
        },
      },
      messages: {
        'username': {
          required: 'Debe ingresar un nombre de usuario',
        },
        'rut': {
          required: "El RUT es un campo requerido",
          rutChileno: "El RUT no es válido (escriba sin puntos y con guión)"
        },        
        'first_name': {
          required: 'El nombre es un campo requerido',
          minlength: 'El nombre debe tener un mínimo de 3 caracteres',
          maxlength: 'El nombre debe tener un máximo de 50 caracteres',
          soloLetras: "El nombre sólo puede contener letras y espacios en blanco",
        },
        'last_name': {
          required: 'El apellido es un campo requerido',
          minlength: 'El apellido debe tener un mínimo de 5 caracteres',
          maxlength: 'El apellido debe tener un máximo de 50 caracteres',
          soloLetras: "El nombre sólo puede contener letras y espacios en blanco",
        },
        'email': {
          required: 'El correo es un campo obligatorio',
          emailCompleto: 'Ingrese un correo válido',
          email: 'Ingrese un correo válido'
        },
        'direccion': {
          required: 'La dirección es un campo requerido',
        },
      },
      errorPlacement: function(error, element) {
        error.insertAfter(element); // Inserta el mensaje de error después del elemento
        error.addClass('error-message'); // Aplica una clase al mensaje de error
      },      
    }
  );
});