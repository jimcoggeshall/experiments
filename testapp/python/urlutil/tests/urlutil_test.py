import unittest
from urlutil import domainext

class TestDomainext(unittest.TestCase):

    url_foo = "https://www.foo.com/?fid=bar"
    url_nohost = "/foo/?a=b"

    def test_get_sld(self):
        sld = domainext.sld_from_url(self.url_foo)
        self.assertEqual(sld, "foo.com")

    def test_get_empty_hostname(self):
        hostname = domainext.hostname_from_url(self.url_nohost)
        self.assertEqual(hostname, "")


if __name__ == '__main__':
    unittest.main()
