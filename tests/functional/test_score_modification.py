from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


def with_wait(test):
    def wrapper(driver):
        wait = WebDriverWait(driver, 5)
        test(driver, wait)
    return wrapper


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

    before = score_name.get_attribute('value')

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
    wait.until_not(
        EC.presence_of_element_located((By.CLASS_NAME, 'info-box'))
    )

    score_list = open_scores_modal(driver, wait).find_element_by_tag_name('ul')

    score_names = \
        (col.find_element_by_css_selector('div.col.s7').text for col in score_list.find_elements_by_tag_name('li'))
    assert "test" in score_names

    driver.find_element_by_css_selector('#scores a.modal-close').click()


@with_wait
def test_deleting_a_score(driver, wait):
    score_list = open_scores_modal(driver, wait).find_element_by_tag_name('ul')

    test_score = list(filter(lambda row: row.find_element_by_css_selector('div.s7').text == "test",
                             score_list.find_elements_by_tag_name('li')))[0]

    ActionChains(driver).move_to_element(test_score).click().pause(1).perform()

    test_score.find_element_by_css_selector('.collapsible-body a:nth-of-type(1)').click()

    wait.until(
        EC.text_to_be_present_in_element((By.CLASS_NAME, 'info-box'), 'Successfully removed')
    )
