import unittest
import app
import json

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        app.app.testing = True
        self.app = app.app.test_client()

    def test_request_submission(self):
        response = self.app.post('/api/request', json={'query': 'Hello'})
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(response.status_code, 200)
        self.assertIn('query', data)
        self.assertEqual(data['query'], 'Hello')

    def test_admin_response(self):
        # First, submit a request
        self.app.post('/api/request', json={'query': 'Hello'})
        # Now, post an admin response
        response = self.app.post('/api/admin/response', json={'id': 1, 'response': 'Hi there!'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_data(as_text=True), 'Response updated')

    def test_get_response(self):
        # First, submit a request
        self.app.post('/api/request', json={'query': 'Hello'})
        # Get the response (should be pending)
        response = self.app.get('/api/response/1')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Response pending', response.get_data(as_text=True))
        # Now, post an admin response and check again
        self.app.post('/api/admin/response', json={'id': 1, 'response': 'Hi there!'})
        response = self.app.get('/api/response/1')
        data = json.loads(response.get_data(as_text=True))
        self.assertEqual(data['response'], 'Hi there!')


if __name__ == '__main__':
    unittest.main()
