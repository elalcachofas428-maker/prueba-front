
from django.contrib.auth import get_user_model
User = get_user_model()
email = 'Charlyadmin@gmail.com'
password = 'Elcharlesx143'
try:
    user = User.objects.get(email=email)
    user.set_password(password)
    user.save()
    print('Password updated for existing user')
except User.DoesNotExist:
    try:
        user = User.objects.create_superuser(username='Charlyadmin', email=email, password=password)
    except TypeError:
        user = User.objects.create_superuser(email=email, password=password)
    print('Created new superuser')

