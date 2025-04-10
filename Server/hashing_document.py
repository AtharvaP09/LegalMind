#This code for hashing is adapted from Fabio Musani via youtube

import hashlib

path = r'C:\Users\Lenovo\OneDrive\Documents\SEMESTER 5 MINI PROJECT\lease_report.pdf'

# with open(path, 'rb') as opened_file: #rb = read binary
#     content = opened_file.read()
#     md5 = hashlib.md5()
#     sha1 = hashlib.sha1()
#     sha224 = hashlib.sha224()
#     sha256 = hashlib.sha256()
#     sha384 = hashlib.sha384()
#     sha512 = hashlib.sha512()

#     md5.update(content)
#     sha1.update(content)
#     sha224.update(content)
#     sha256.update(content)
#     sha384.update(content)
#     sha512.update(content)

#     print('Result')
#     print()
#     print('{}: {}'.format(md5.name, md5.hexdigest()))
#     #hexdigest is hash in hexadecimal
#     print('{}: {}'.format(sha1.name, sha1.hexdigest()))
#     print('{}: {}'.format(sha224.name, sha224.hexdigest()))
#     print('{}: {}'.format(sha256.name, sha256.hexdigest()))
#     print('{}: {}'.format(sha384.name, sha384.hexdigest()))
#     print('{}: {}'.format(sha512.name, sha512.hexdigest()))

    #There is a better way to do this...updated code

md5 = hashlib.md5()
sha1 = hashlib.sha1()
sha224 = hashlib.sha224()
sha256 = hashlib.sha256()
sha384 = hashlib.sha384()
sha512 = hashlib.sha512()

list_hash_objects = [md5,sha1,sha224,sha256,sha384,sha512]

# with open(path, 'rb') as opened_file:
#     print('Result')
#     print()
#     content = opened_file.read()
#     for hash_object in list_hash_objects:
#         hash_object.update(content)
#         print(print('{}: {}'.format(hash_object.name, hash_object.hexdigest())))

for hash_object in list_hash_objects:
    with open(path, 'rb') as opened_file:
        for line in opened_file:
            hash_object.update(line)
        print('{}: {}'.format(hash_object.name, hash_object.hexdigest()))
    
