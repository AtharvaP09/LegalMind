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

import hashlib
import os

def generate_file_hashes(file_path, algorithm='sha256'):
    """
    Generate a cryptographic hash for a file using the specified algorithm.
    Optimized for security and performance.
    
    Args:
        file_path (str): Absolute path to the file
        algorithm (str): Hash algorithm (default: 'sha256'). Options:
                        'md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512'
    
    Returns:
        str: Hexadecimal digest of the file
    
    Raises:
        FileNotFoundError: If file doesn't exist
        ValueError: If unsupported algorithm is specified
        RuntimeError: If file reading fails
    """
    # Validate algorithm choice
    if algorithm not in hashlib.algorithms_available:
        raise ValueError(f"Unsupported algorithm. Choose from: {hashlib.algorithms_available}")

    # Verify file existence
    if not os.path.isfile(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    # Initialize selected hash object
    hash_obj = hashlib.new(algorithm)

    try:
        # Read file in 4KB chunks for memory efficiency
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b''):
                hash_obj.update(chunk)  # Update hash with each chunk
    except Exception as e:
        raise RuntimeError(f"Hashing failed: {str(e)}")

    return hash_obj.hexdigest()  # Return hexadecimal representation