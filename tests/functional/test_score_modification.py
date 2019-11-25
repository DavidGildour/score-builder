import pytest

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from .utils import with_wait, get_number_of_notes, get_number_of_voices, open_scores_modal, add_random_note


@pytest.mark.first
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


@pytest.mark.order2
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
    wait.until_not(
        EC.visibility_of_element_located((By.ID, 'scores'))
    )


@pytest.mark.order3
def test_adding_eightnotes(driver):
    staff = driver.find_element_by_tag_name('svg')
    notes_before = get_number_of_notes(staff)

    for _ in range(8):
        add_random_note(staff, driver)

    notes_after = get_number_of_notes(staff)
    assert notes_after - notes_before == 7 # not eight, since we're replacing the first pause with the note


@with_wait
@pytest.mark.order4
def test_adding_and_removing_voices(driver, wait):
    import time
    assert get_number_of_voices(driver) == 2

    driver.find_element_by_name('addVoice').click()
    time.sleep(5)

    assert get_number_of_voices(driver) == 3

    staff = driver.find_element_by_css_selector('#stave0 svg')
    voice_select = driver.find_element_by_css_selector('#voices .select-wrapper')
    ActionChains(driver)\
        .move_to_element(voice_select).click()\
        .move_to_element(voice_select.find_element_by_css_selector('li:nth-of-type(3)')).click()\
        .perform()
    add_random_note(staff, driver)

    driver.find_element_by_name('removeVoice').click()

    wait.until(
        EC.text_to_be_present_in_element((By.CLASS_NAME, 'info-box'), 'Voice is not empty.')
    )

    driver.find_element_by_name('removeNote').click()
    driver.find_element_by_name('removeVoice').click()

    assert get_number_of_voices(driver) == 2


@pytest.mark.second_to_last
def test_clearing_the_score(driver):
    staff = driver.find_element_by_tag_name('svg')

    driver.find_element_by_name('clearVoices').click()

    assert get_number_of_notes(staff) == 2


@pytest.mark.last
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

    driver.find_element_by_css_selector('#scores .modal-close').click()