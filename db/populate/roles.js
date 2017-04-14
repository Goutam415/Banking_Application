
exports.permissions = {
  id: 1,
  permissions: ['login',
                'update:profile',
                'read:calender',
                'create:booking',
                'update:calender',
                'update:center',
                'access:center',
                'update:center:logo'
              ]
};

exports.groups = {
  'basic': ['login', 'update:profile'],
  'calender-read': ['read:calender'],
  'calender-write': ['create:booking', 'update:calender'],
  'center-admin': ['access:center', 'update:center']
};

exports.roles = [{
  'name': 'doctor',
  'groups': ['basic', 'calender-read'],
  'permissions': []
}, {
  'name': 'staff',
  'groups': ['basic'],
  'permissions': []
}, {
  'name': 'owner',
  'groups': ['basic', 'calender-read', 'calender-write', 'center-admin'],
  'permissions': ['update:center:logo']
}, {
  'name': 'admin',
  'groups': ['basic', 'calender-read', 'calender-write', 'center-admin'],
  'permissions': []
}];
