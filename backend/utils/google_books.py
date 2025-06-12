import requests

def fetch_book_data(isbn: str):
    url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        items = response.json().get("items")
        if not items:
            return None

        volume_info = items[0]["volumeInfo"]

        return {
            "title": volume_info.get("title"),
            "author": ", ".join(volume_info.get("authors", [])),
            "publisher": volume_info.get("publisher"),
            "subject": volume_info.get("categories", []),
        }
    except requests.RequestException as e:
        print(f"Error fetching book data: {e}")
        return None
