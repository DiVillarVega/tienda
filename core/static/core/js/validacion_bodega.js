$(document).ready(function() {
  
  // Agregar método de validación para que un campo sólo acepte 
  // letras y espacios en blanco, pero no números ni símbolos,
  // ideal para campos como nombres y apellidos
  $.validator.addMethod("soloLetras", function(value, element) {

    return this.optional(element) || /^[a-zA-Z\s]*$/.test(value);

  }, "Sólo se permiten letras y espacios en blanco.");


  // Validar Números con % como descuentos pa
  $.validator.addMethod("soloNumeros", function(value, element) {

    return this.optional(element) || /^[0-9]+%*$/.test(value);

  }, "Sólo se permiten números.");

  // Validar formulario de bodega
  $('#formulario_bodega').validate(
    {
      rules: {
        categoria:{
          required: true
        },
        cantidad: {
          required: true,
          min: 1
        },
        titulo: {
          required: true,
          minlength: 1,
          maxlength: 60
        }
      },
      messages: {
        categoria: {
          required: "La categoría es un campo requerido."
        },
        cantidad: {
          required: "La cantidad es un campo requerido.",
          min: "La cantidad debe ser mayor a 0."
        },
        titulo: {
          required: "El título es un campo requerido.",
          minlength: "El título debe tener un mínimo de 1 caracter.",
          maxlength: "El título debe tener un máximo de 60 caracteres."
        }
      }
    }
  );
  // COMBOBOX DEPENDIENTES PARA CATEGORIA Y PRODUCTO
  $("#id_categoria").change(function() {
    var categoriaId = $(this).val();
    if (categoriaId) {
      $.ajax({
        url: $('#url_obtener_productos').val(),
        data: {
          'categoria_id': categoriaId
        },
        dataType: 'json',
        success: function(data) {
          $("#id_producto").empty();
          $('#cuadro-imagen').attr('src', sin_imagen);
          if (data.length === 0) {
            $("#id_producto").append(`<option value="-1" data-imagen="${sin_imagen}">No hay productos disponibles</option>`);
          } else {
            $("#id_producto").append(`<option value="-1" selected="" data-imagen="${sin_imagen}">Seleccione un producto</option>`);
            $.each(data, function(key, value) {
              $("#id_producto").append(`<option value="${value.id}" data-imagen="${value.imagen}"> ${value.nombre} </option>`);
            });
          }
          $("#id_producto").prop('disabled', false);
        }
      });
    } else {
      $("#id_producto").empty();
      $("#id_producto").prop('disabled', true);
    }
  });

  // COMBOBOX DE PRODUCTO: Cuando el usuario selecciona un producto se carga la imagen del producto
  $("#id_producto").change(function() {
    var opcionSeleccionada = $(this).find(':selected');
    var imagen = opcionSeleccionada.data('imagen');
    $('#cuadro-imagen').attr('src', imagen);
  });
});