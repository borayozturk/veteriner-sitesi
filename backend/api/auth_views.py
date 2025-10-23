from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({
            'success': False,
            'message': 'Kullanıcı adı ve şifre gereklidir'
        }, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return Response({
            'success': True,
            'message': 'Giriş başarılı',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser
            }
        })
    else:
        return Response({
            'success': False,
            'message': 'Kullanıcı adı veya şifre hatalı'
        }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """Logout endpoint"""
    logout(request)
    return Response({
        'success': True,
        'message': 'Çıkış başarılı'
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_auth(request):
    """Check if user is authenticated"""
    return Response({
        'success': True,
        'authenticated': True,
        'user': {
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'is_staff': request.user.is_staff,
            'is_superuser': request.user.is_superuser
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_users(request):
    """Get all users"""
    users = User.objects.all().order_by('-date_joined')
    return Response({
        'success': True,
        'users': [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_active': user.is_active,
            'date_joined': user.date_joined
        } for user in users]
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    """Create new user"""
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    is_staff = request.data.get('is_staff', True)
    is_superuser = request.data.get('is_superuser', False)

    if not username or not password:
        return Response({
            'success': False,
            'message': 'Kullanıcı adı ve şifre gereklidir'
        }, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({
            'success': False,
            'message': 'Bu kullanıcı adı zaten kullanılıyor'
        }, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        is_staff=is_staff,
        is_superuser=is_superuser,
        is_active=True  # Ensure user is active
    )

    return Response({
        'success': True,
        'message': 'Kullanıcı başarıyla oluşturuldu',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        }
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, user_id):
    """Update user"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Kullanıcı bulunamadı'
        }, status=status.HTTP_404_NOT_FOUND)

    user.email = request.data.get('email', user.email)
    user.first_name = request.data.get('first_name', user.first_name)
    user.last_name = request.data.get('last_name', user.last_name)
    user.is_staff = request.data.get('is_staff', user.is_staff)
    user.is_superuser = request.data.get('is_superuser', user.is_superuser)
    user.is_active = request.data.get('is_active', user.is_active)

    # Update password if provided
    password = request.data.get('password')
    if password:
        user.set_password(password)

    user.save()

    return Response({
        'success': True,
        'message': 'Kullanıcı başarıyla güncellendi',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'is_active': user.is_active
        }
    })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    """Delete user"""
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Kullanıcı bulunamadı'
        }, status=status.HTTP_404_NOT_FOUND)

    # Prevent deleting yourself
    if user.id == request.user.id:
        return Response({
            'success': False,
            'message': 'Kendi hesabınızı silemezsiniz'
        }, status=status.HTTP_400_BAD_REQUEST)

    user.delete()

    return Response({
        'success': True,
        'message': 'Kullanıcı başarıyla silindi'
    })
