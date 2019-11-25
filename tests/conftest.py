import pytest

from selenium import webdriver


@pytest.fixture(scope='module')
def driver():
    """ selenium driver for functional testing """
    driver = webdriver.Firefox()
    driver.get('http:127.0.0.1:3000/')

    yield driver

    driver.close()
