from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


def with_wait(test):
    def wrapper(driver):
        wait = WebDriverWait(driver, 5)
        test(driver, wait)
    return wrapper


@with_wait
def test_adding_new_score(driver, wait):
    login = wait.until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, 'div.user-form'))
    )[1]

    login.find_element_by_name('username').send_keys('admin')
    login.find_element_by_name('password').send_keys('admin', Keys.ENTER)

    score_name = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, '.score-name input#name'))
    )

    before =score_name.get_attribute('value')

    wait.until_not(EC.presence_of_element_located((By.CLASS_NAME, 'info-box')))
    add_button = wait.until(
        EC.element_to_be_clickable((By.ID, 'addscore'))
    )
    add_button.click()

    after = score_name.get_attribute('value')

    assert before != after


@with_wait
def test_changing_score_name(driver, wait):
    score_name = driver.find_element_by_css_selector('.score-name input#name')

    score_name.clear()
    score_name.send_keys('test')

    save_button = driver.find_element_by_id('save-score')
    save_button.click()

    wait.until(
        EC.text_to_be_present_in_element((By.CLASS_NAME, 'info-box'), 'Successfully added new score')
    )