import time
import random
import pytest

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789'

USER = {
    'name': ''.join([random.choice(ALPHABET) for _ in range(10)]),
    'email': ''.join([random.choice(ALPHABET) for _ in range(10)]) + '@test.com',
    'password': ''.join([random.choice(ALPHABET) for _ in range(10)]),
}

def test_home_page(driver):
    driver.get('http:127.0.0.1:3000/')

    assert driver.title == 'Score Builder', f"Page title doesn't match.\n Expected 'Score Builder', got {driver.title}"

def test_changing_lang(driver):
    lang = driver.find_element_by_id('lang')

    assert 'Language' in lang.text

    actions = ActionChains(driver)
    actions.move_to_element(lang)
    actions.perform()

    languages = driver.find_element_by_id('lang-dropdown').find_elements_by_tag_name('a')

    # testing changing to polish
    languages[0].click()

    assert 'Język' in lang.text

    # testing changing back to english
    languages[1].click()

    assert 'Language' in lang.text

def test_about_modal(driver):
    about = driver.find_element_by_partial_link_text('About')
    about.click()

    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'about'))
    )
    header = modal.find_element_by_tag_name('h4')

    assert 'About' in header.text

    paragraph = modal.find_element_by_tag_name('p')

    assert paragraph.text.startswith('Welcome to Score Builder!')

    modal.find_element_by_class_name("modal-close").click()

def test_help_modal(driver):
    navbar = driver.find_element_by_tag_name('nav')
    help = navbar.find_element_by_xpath("//a[@data-tooltip='Help']")
    ActionChains(driver).move_to_element(help).click().perform()

    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'help'))
    )

    assert modal.text.startswith('Help')

    paragraph = modal.find_element_by_tag_name('p')

    assert paragraph.text.startswith('Click on the stave to add a note.')

    modal.find_element_by_class_name("modal-close").click()

def test_user_register(driver):
    register = driver.find_element_by_link_text('Register')
    ActionChains(driver).move_to_element(register).click().perform()

    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'register'))
    )

    modal.find_element_by_name('username').send_keys(USER['name'])
    modal.find_element_by_name('email').send_keys(USER['email'])
    modal.find_element_by_name('password1').send_keys(USER['password'])
    modal.find_element_by_name('password2').send_keys(USER['password'], Keys.ENTER)

    try:
        WebDriverWait(driver, 5).until(
            EC.text_to_be_present_in_element((By.ID, 'register'), 'User successfully created.')
        )
    except:
        pytest.fail('Failed to register.')

    assert modal.text.startswith('User successfully created.')

    modal.find_element_by_class_name("modal-close").click()

def test_user_login(driver):
    login = driver.find_element_by_link_text('Log in')
    ActionChains(driver).move_to_element(login).click().perform()
    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'login'))
    )

    modal.find_element_by_name('username').send_keys(USER['name'])
    modal.find_element_by_name('password').send_keys(USER['password'], Keys.ENTER)

    info = driver.find_element_by_class_name('info-box')

    assert info.get_attribute('data-tooltip') == 'Logged In.'

def test_user_dropdown(driver):
    user_menu = driver.find_element_by_id('user-opt')
    ActionChains(driver).move_to_element(user_menu).perform()
    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'user-dropdown'))
    )
    menu_options = modal.find_elements_by_tag_name('a')

    assert menu_options[0].text.startswith('Edit profile')
    assert menu_options[1].text.startswith('Log out')

    menu_options[0].click()

    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'user-info'))
    )

    assert modal.text.startswith('User info:')

    fields = modal.find_elements_by_class_name('collection-item')[:2]
    for field in fields:
        assert field.find_element_by_class_name('secondary-content').text in USER.values()

def test_editing_profile(driver):
    modal = driver.find_element_by_id('user-info')

    password_change = modal.find_elements_by_tag_name('span')[2]
    password_change.click()

    modal.find_element_by_id('old_password').send_keys(USER['password'])
    new_pass = ''.join([random.choice(ALPHABET) for _ in range(10)])
    modal.find_element_by_id('password1').send_keys(new_pass)
    modal.find_element_by_id('password2').send_keys(new_pass, Keys.ENTER)
    USER['password'] = new_pass

    try:
        WebDriverWait(driver, 5).until(
            EC.text_to_be_present_in_element((By.CLASS_NAME, 'lime-text'), 'Password changed.')
        )
    except:
        pytest.fail('Failed to change password.')

    modal.find_element_by_class_name("modal-close").click()

def test_logout(driver):
    user_menu = driver.find_element_by_id('user-opt')
    ActionChains(driver).move_by_offset(1,1).move_to_element(user_menu).perform()
    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'user-dropdown'))
    )
    logout = modal.find_elements_by_tag_name('a')[1]

    logout.click()

    info = driver.find_element_by_class_name('info-box')

    assert info.get_attribute('data-tooltip') == 'Logged Out.'

def test_login_with_new_password(driver):
    test_user_login(driver)
