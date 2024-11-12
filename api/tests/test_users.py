import unittest

import requests


class TestUser(unittest.TestCase):
    """Test user-related endpoints"""

    def test_get_user(self) -> None:
        test_id = "user_2nJSrNr6b6d93uYcTDLGAPG7lOa"
        url = f"http://127.0.0.1:3000/api/v1/users/{test_id}"
        response = requests.get(url)
        self.assertTrue(response.status_code == 200)
