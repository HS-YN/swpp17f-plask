from django.test import TestCase, Client
import json
'''
class LocationTestCase(TestCase):
    def locParse(instr) :
        loclist = servParse(instr)
        result = []
        for loc in loclist :
            semiResult = []
            loc = loc.replace('/', ' ')
            tokens = loc.split()
            for tok in tokens :
                semiResult.append(tok)
            result.append(semiResult)
        return result

    def servParse(instr) : 
        instr = instr.replace(';', ' ')
        tokens = instr.split()
        result = []
        for tok in tokens :
            result.append(tok)
        return result

    def testParser(self):
        print('a/b/c : '+locParse('a/b/c'))
        print('a;b/c;d/e/f : '+locParse('a;b/c;d/e/f'))
        print('a;b;c;d : ' + servParse('a;b;c;d'))
        



'''
# Create your tests here.
