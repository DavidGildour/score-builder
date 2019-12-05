import random
import datetime
import inspect
import os

from functools import wraps

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import *
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789'
NOTABLE_EXCEPTIONS = (
    NoSuchElementException,
    TimeoutException,
    ElementNotInteractableException,
    ElementClickInterceptedException,
    ElementNotSelectableException,
    ElementNotVisibleException,
    AssertionError
)


def save_screenshot_on_fail(test):
    def wrapper(driver, *args):
        try:
            test(driver, *args)
        except NOTABLE_EXCEPTIONS as e:
            if not os.path.exists('./screenshots/'):
                os.mkdir('./screenshots/')
            time = str(datetime.datetime.now())[:16].replace(" ", "_").replace(":", ".")
            filename = os.path.join(
                os.path.abspath('.'),
                'screenshots',
                f"{time}.png"
            )
            driver\
                .find_element_by_tag_name('body')\
                .screenshot(filename)
            raise e
    return wrapper


def choose_from_dropdown(driver, dropdown_selector, choice):
    dropdown = driver.find_element_by_css_selector(dropdown_selector)
    x, y = dropdown.location.values()
    driver.execute_script(f'window.scrollTo({x}, {y});')
    ActionChains(driver).move_to_element(dropdown).click().perform()
    options = dropdown.find_elements_by_tag_name('li')
    options[choice].click()


def log(*messages):
    with open('test.log', 'a') as f:
        for msg in messages:
            f.write(
                f"\n{datetime.datetime.now()}::{inspect.stack()[1].function} >> {msg}"
            )


def generate_random_string(length: int = 10) -> str:
    return ''.join([random.choice(ALPHABET) for _ in range(length)])


def get_random_userdata():
    return {
        'name': generate_random_string(),
        'email': generate_random_string() + '@test.com',
        'password': generate_random_string(),
    }


def get_user_dropdown_options(driver) -> list:
    user_menu = driver.find_element_by_id('user-opt')
    ActionChains(driver).move_by_offset(1, 1).move_to_element(user_menu).perform()
    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'user-dropdown'))
    )
    return modal.find_elements_by_tag_name('a')


def with_wait(test):
    def wrapper(driver):
        wait = WebDriverWait(driver, 5)
        test(driver, wait)
    return wrapper


def get_number_of_voices(driver):
    return len(driver.find_elements_by_css_selector('#voices ul li'))


def get_number_of_notes(staff):
    return len(staff.find_elements_by_class_name('vf-note'))


def open_scores_modal(driver, wait):
    user_menu = driver.find_element_by_id('user-opt')
    driver.execute_script('window.scrollTo(0, 0);')
    ActionChains(driver).move_by_offset(1, 1).move_to_element(user_menu).perform()
    dropdown = wait.until(
        EC.element_to_be_clickable((By.ID, 'user-dropdown'))
    )
    dropdown.find_elements_by_tag_name('a')[1].click()

    return wait.until(
        EC.presence_of_element_located((By.ID, 'scores'))
    )


def add_random_note(staff, driver):
    right_bar = staff.find_elements_by_tag_name('rect')[1].location['x']
    x_offset = right_bar - staff.location['x'] - 5
    top_line = staff.find_elements_by_tag_name('path')[0].location['y'] - staff.location['y']
    bottom_line = staff.find_elements_by_tag_name('path')[4].location['y'] - staff.location['y']
    y_offset = random.randrange(top_line, bottom_line)
    ActionChains(driver).move_to_element_with_offset(staff, x_offset, y_offset).click().perform()


def check_if_this_changes_the_pitch(transposition):
    return (
        transposition.count(Keys.ARROW_DOWN) != transposition.count(Keys.ARROW_UP) or
        transposition.count(Keys.PAGE_DOWN) != transposition.count(Keys.PAGE_UP)
    )
