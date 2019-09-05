import pytest

from selenium import webdriver

@pytest.fixture(scope='module')
def driver():
    """ selenium driver for functional testing """
    driver = webdriver.Firefox()

    yield driver

    driver.close()
