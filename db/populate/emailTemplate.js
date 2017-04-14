exports.templates = [
  {
    'templateID': 'cancel_appointment',
    'content': 'Your appointment is cancelled',
    'active': true,
    'center_id': '0000',
    'name': 'Appointment Cancellation',
    'hint': 'A cancellation sms will be sent',
    'attributes_used': [{
      'key': 'patient_name',
      'display_value': 'Patient name',
      'active': true
    },
    {
      'key': 'center_name',
      'display_value': 'Center name',
      'active': true
    }]
  },
  {
    'templateID': 'confirm_appointment',
    'content': 'Your appointment is confirmed',
    'active': true,
    'center_id': '0000',
    'name': 'Appointment Confirmation',
    'hint': 'A confirmation sms will be sent',
    'attributes_used': [{
      'key': 'patient_name',
      'display_value': 'Patient name',
      'active': true
    },
    {
      'key': 'center_name',
      'display_value': 'Center name',
      'active': true
    }]
  }

];



