from setuptools import setup, find_packages
setup(
    name="urlutil",
    version="1.0",
    packages=find_packages(),
    test_suite="tests",
    scripts=["scripts/url2sld"],
    python_requires=">=3.6",
    install_requires=["tldextract>=2.2.1"],
    author="Jim Coggeshall",
    author_email="jim@jimcoggeshall.com",
    description="Handy python wrappers for dealing with URLs"
)
