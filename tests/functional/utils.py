import random

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789'

USER = {}


def generate_random_string(length = 10) -> str:
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
    ActionChains(driver).move_by_offset(1, 1).move_to_element(user_menu).perform()
    dropdown = wait.until(
        EC.element_to_be_clickable((By.ID, 'user-dropdown'))
    )
    dropdown.find_elements_by_tag_name('a')[1].click()

    return wait.until(
        EC.presence_of_element_located((By.ID, 'scores'))
    )


def add_random_note(staff, driver):
    x_offset = staff.get_property('width')['animVal']['value'] - 60
    y_offset = random.randrange(88, 128)
    ActionChains(driver).move_to_element_with_offset(staff, x_offset, y_offset).click().perform()