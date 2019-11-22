import random
import pytest

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJLKMNOPQRSTUVWXYZ0123456789'

USER = {}


def get_random_userdata():
    return {
        'name': ''.join(random.choice(ALPHABET) for _ in range(10)),
        'email': ''.join(random.choice(ALPHABET) for _ in range(10)) + '@test.com',
        'password': ''.join(random.choice(ALPHABET) for _ in range(10)),
    }


def get_user_dropdown_options(driver) -> list:
    user_menu = driver.find_element_by_id('user-opt')
    ActionChains(driver).move_by_offset(1,1).move_to_element(user_menu).perform()
    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'user-dropdown'))
    )
    return modal.find_elements_by_tag_name('a')


def test_home_page(driver):
    assert driver.title == 'Score Builder', f"Page title doesn't match.\n Expected 'Score Builder', got {driver.title}"


def test_changing_lang(driver):
    lang = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'lang'))
    )

    assert 'Language' in lang.text

    ActionChains(driver).move_by_offset(1, 1).move_to_element(lang).perform()

    languages = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'lang-dropdown'))
    ).find_elements_by_tag_name('a')
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


def test_user_register(driver):
    global USER
    USER = get_random_userdata()
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CLASS_NAME, 'user-form'))
    )
    register = driver.find_elements_by_class_name('user-form')[0]

    register.find_element_by_name('email').send_keys(USER['email'])
    register.find_element_by_name('username').send_keys(USER['name'])
    register.find_element_by_name('password1').send_keys(USER['password'])
    register.find_element_by_name('password2').send_keys(USER['password'], Keys.ENTER)

    try:
        WebDriverWait(driver, 5).until(
            lambda _: any(map(lambda e: e.text.startswith(f'User successfully created.'),
                              driver.find_elements_by_class_name('info-box')))
        )
    except:
        pytest.fail('Failed to register.')


def test_user_login(driver):
    login = driver.find_elements_by_class_name('user-form')[1]

    login.find_element_by_name('username').send_keys(USER['name'])
    login.find_element_by_name('password').send_keys(USER['password'], Keys.ENTER)

    try:
        WebDriverWait(driver, 5).until(
            lambda _: any(map(lambda e: e.text.startswith(f'Logged in.'),
                              driver.find_elements_by_class_name('info-box')))
        )
    except:
        pytest.fail('Failed to login.')


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


def test_user_dropdown(driver):
    menu_options = get_user_dropdown_options(driver)

    assert menu_options[0].text.startswith('Edit profile')
    assert menu_options[1].text.startswith('My scores')
    assert menu_options[2].text.startswith('Log out')

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
            lambda _: any(map(lambda e: e.text.startswith(f'Password changed.'),
                              driver.find_elements_by_class_name('info-box')))
        )
    except:
        pytest.fail('Failed to change password.')

    modal.find_element_by_class_name("modal-close").click()


def test_logout(driver):
    logout = get_user_dropdown_options(driver)[2]

    logout.click()

    try:
        WebDriverWait(driver, 5).until(
            lambda _: any(map(lambda e: e.text.startswith(f'Logged out.'),
                              driver.find_elements_by_class_name('info-box')))
        )
    except:
        pytest.fail('Failed to log out.')


def test_login_with_new_password(driver):
    test_user_login(driver)


def test_deleting_a_user(driver):
    edit_profile = get_user_dropdown_options(driver)[0]
    edit_profile.click()

    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'user-info'))
    )

    modal.find_element_by_id('delete').click()
    info = modal.find_element_by_id('info')

    WebDriverWait(driver, 1).until(
        EC.text_to_be_present_in_element((By.ID, 'info'), 'Warning!\nThis action is irreversible')
    )

    # lets first check if you can cancel this
    ActionChains(driver).pause(1).move_to_element(info.find_element_by_id('cancel')).click().perform()

    # then lets delete the user
    modal.find_element_by_id('delete').click()
    info = modal.find_element_by_id('info')
    ActionChains(driver).pause(1).move_to_element(info.find_element_by_id('confirm')).click().perform()

    # this should automatically logout

    try:
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'user-form'))
        )
    except:
        pytest.fail('Didn\'t actually delete the user or something went wrong.')

    # so lets try to login on our now-nonexistent user's credentials

    login = driver.find_elements_by_class_name('user-form')[1]

    login.find_element_by_name('username').send_keys(USER['name'])
    login.find_element_by_name('password').send_keys(USER['password'], Keys.ENTER)

    try:
        WebDriverWait(driver, 5).until(
            lambda _: any(map(lambda e: e.text.startswith(f'Invalid credentials'),
                              driver.find_elements_by_class_name('info-box')))
        )
    except:
        pytest.fail('Probably some internal server error.')


def test_admin_panel(driver):
    # first lets register a user
    test_user_register(driver)
    # lets login as an admin
    login = driver.find_elements_by_class_name('user-form')[1]

    login.find_element_by_name('username').send_keys('admin')
    login.find_element_by_name('password').send_keys('admin', Keys.ENTER)

    try:
        WebDriverWait(driver, 5).until(
            EC.text_to_be_present_in_element((By.TAG_NAME, 'nav'), 'User list')
        )
    except:
        pytest.fail('Failed to log in as an admin.')
    import time
    time.sleep(2)
    driver.find_element_by_link_text('User list').click()

    modal = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.ID, 'userlist'))
    )

    WebDriverWait(driver, 5).until(
        EC.text_to_be_present_in_element((By.ID, 'userlist'), 'Registered users:')
    )

    found = None

    while not found:
        try:
            headers = modal.find_elements_by_class_name('collapsible-header')
            usernames = list(
                map(lambda x: x.find_elements_by_class_name('col')[1].text, headers))
            assert USER['name'] in usernames
            found = list(filter(lambda header: USER['name'] in header.text, headers))[0]
        except AssertionError:
            next = modal.find_element_by_id('page_next')
            if next.get_attribute('class') == 'disabled':
                pytest.fail(f'{USER["name"]} not found, probably registration failed.')
            next.click()

    found.click()
    body = WebDriverWait(driver, 5).until(
        EC.visibility_of_any_elements_located((By.CLASS_NAME, 'collapsible-body'))
    )[0]
    body.find_element_by_id('delete_user').click()

    try:
        WebDriverWait(driver, 5).until(
            lambda _: any(map(lambda e: e.text.startswith(f'User {USER["name"]}'), driver.find_elements_by_class_name('info-box')))
        )
    except:
        pytest.fail('Failed to delete a user.')

    modal.find_element_by_class_name('btn-flat').click()
