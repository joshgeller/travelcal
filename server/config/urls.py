from calendars.views import CalendarViewSet
from django.conf.urls import include, patterns, url
from django.contrib import admin
from rest_framework.authtoken import views
from rest_framework.routers import SimpleRouter
from trips.views import TripViewSet
from users.views import AccountViewSet

from .views import IndexView

router = SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'trips', TripViewSet)
router.register(r'calendars', CalendarViewSet)


urlpatterns = [
    # Obtain auth token
    url(r'^api-token-auth/', views.obtain_auth_token),
    # API
    url(r'^api/v1/accounts/set_password/$', AccountViewSet.as_view({'post': 'set_password'}), name='set_password'),
    url(r'^api/v1/', include(router.urls)),

    # Admin
    url(r'^admin/', admin.site.urls),
]

# Client app
urlpatterns += patterns('',
                        url(r'^', IndexView.as_view(), name='index'),
                        )
