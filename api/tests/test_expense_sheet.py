import unittest

import requests


class TestExpenseSheet(unittest.TestCase):
    """Test expense-sheet-related endpoints"""

    def test_get_expense_sheet_year(self) -> None:
        url = "http://127.0.0.1:3000/api/v1/expense_sheet/2024"
        response = requests.get(url)
        self.assertTrue(response.status_code == 200)
        self.assertEqual(
            response.json().get("id"),
            "1Hnz6yYzPLc2MPd77oyCDzQ4qqSKbPotyhGvLBEEgROw",
        )
