# this script converts items.xlsx to items.json
from openpyxl import load_workbook
import json

wb = load_workbook("items.xlsx")
items_sheet = wb["items"]

items = []

for i, row in enumerate(items_sheet.values):
    if (i == 0):
        continue
    # add rows to items map
    item = {
        "_id": row[0],
        "for_sale": row[1],
        "countries": json.loads(row[2]),
        "img_urls": json.loads(row[3]),
        "tags": json.loads(row[4]),
        "times_acquired": json.loads(row[5])
    }
    items.append(item)

# eliminar [ al comienzo y ] al final
txt = json.dumps(items, indent=1)[1:-1]
# remover comas entre objetos
semi = 0
i = 0
while (i < len(txt)):
    if (txt[i] == "{"):
        semi += 1
    elif (txt[i] == "}"):
        semi -= 1
    if (semi == 0 and txt[i] == ","):
        txt = txt[0:i] + txt[i + 1:]
        i -= 1
    i += 1

items_file = open("items.json", "w")
items_file.write(txt)

# original countries field, in case screwed something up
# {"col":{"available":{"red":{"total":0,"s":0,"m":0,"l":0},"black":{"total":0,"s":0,"m":0,"l":0},},"price":40000.0,"ccy":"cop"},"usa":{"available":{"red":{"total":0,"s":0,"m":0,"l":0},"black":{"total":0,"s":0,"m":0,"l":0},},"price":40000.0,"ccy":"cop"}}