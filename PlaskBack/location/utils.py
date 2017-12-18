from .models import LocationL1, LocationL2, LocationL3
import csv

def loc_to_dict (location):
    result = {}
    result['loc_name'] = location.name
    result['loc_code'] = location.loc_code
    return result

def getLocationFromCSVFile(path):
    with open(path) as f:
        reader = csv.reader(f)
        for row in reader:
            level1, _ = LocationL1.objects.get_or_create(
                loc_code=int(row[0]), name=str(row[1]))
            level2, created = LocationL2.objects.get_or_create(
                loc_code=int(row[2]), name=str(row[3]))
            level3, _ = LocationL3.objects.get_or_create(
                loc_code=int(row[4]), name=str(row[5]))
            if (created):
                level2.parent = level1
                level2.save()
            level3.parent = level2
            level3.save()