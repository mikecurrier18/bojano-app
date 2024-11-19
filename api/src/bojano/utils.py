def normalize_price(price: str) -> str:
    return price.replace("$", "").replace(",", "")
