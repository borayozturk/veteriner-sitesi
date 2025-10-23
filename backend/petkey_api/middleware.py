class UTF8Middleware:
    """Middleware to ensure UTF-8 encoding in all responses"""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Ensure Content-Type includes UTF-8 charset for JSON responses
        if 'application/json' in response.get('Content-Type', ''):
            if 'charset' not in response.get('Content-Type', ''):
                response['Content-Type'] = 'application/json; charset=utf-8'

        return response
