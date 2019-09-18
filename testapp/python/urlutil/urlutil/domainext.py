import urllib
import tldextract
import argparse

extract = tldextract.TLDExtract(suffix_list_urls=None)

def hostname_from_url(in_url):
    url = urllib.parse.urlparse(in_url)
    hostname = url.hostname
    if (hostname == None):
        hostname = ""
    return hostname

def sld_from_url(in_url):
    hostname = hostname_from_url(in_url)
    tldx = extract(hostname)
    return ".".join([tldx.domain, tldx.suffix])

def tld_from_url(in_url):
    hostname = hostname_from_url(in_url)
    tldx = extract(hostname)
    return tldx.suffix
