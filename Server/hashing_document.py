import hashlib
import os

# ---------------------- ORIGINAL CODE (Commented) ----------------------

# # This code for hashing is adapted from Fabio Musani via YouTube
# import hashlib
# path = r'C:\Users\Lenovo\OneDrive\Documents\SEMESTER 5 MINI PROJECT\lease_report.pdf'

# md5 = hashlib.md5()
# sha1 = hashlib.sha1()
# sha224 = hashlib.sha224()
# sha256 = hashlib.sha256()
# sha384 = hashlib.sha384()
# sha512 = hashlib.sha512()

# list_hash_objects = [md5, sha1, sha224, sha256, sha384, sha512]

# for hash_object in list_hash_objects:
#     with open(path, 'rb') as opened_file:
#         for line in opened_file:
#             hash_object.update(line)
#         print('{}: {}'.format(hash_object.name, hash_object.hexdigest()))

# ---------------------- GENERALIZED VERSION ----------------------

def generate_file_hashes(file_path):
    """
    Generate multiple hash digests (MD5, SHA1, SHA224, SHA256, SHA384, SHA512)
    for the given file.
    
    :param file_path: Full path to the file
    :return: Dictionary containing hash name and hex digest
    """
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    hash_algorithms = [
        hashlib.md5(),
        hashlib.sha1(),
        hashlib.sha224(),
        hashlib.sha256(),
        hashlib.sha384(),
        hashlib.sha512()
    ]

    try:
        with open(file_path, 'rb') as file:
            # Read the file in chunks (4 KB) for memory efficiency
            for chunk in iter(lambda: file.read(4096), b''):
                for hash_object in hash_algorithms:
                    hash_object.update(chunk)
    except Exception as e:
        raise RuntimeError(f"Error reading file: {e}")

    return {h.name: h.hexdigest() for h in hash_algorithms}


# ---------------------- USAGE EXAMPLE ----------------------

if __name__ == "__main__":
    file_path = r'C:\Users\Lenovo\OneDrive\Documents\SEMESTER 5 MINI PROJECT\lease_report.pdf'
    
    try:
        hashes = generate_file_hashes(file_path)
        print("Hash Results:")
        for algo, digest in hashes.items():
            print(f"{algo}: {digest}")
    except Exception as e:
        print("Error:", e)
