import pytest
import random

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from .utils import (
    with_wait,
    get_number_of_notes,
    get_number_of_voices,
    open_scores_modal,
    add_random_note,
    check_if_this_changes_the_pitch
)


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


@pytest.mark.run(order=2)
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


@pytest.mark.run(order=3)
def test_adding_eightnotes(driver):
    staff = driver.find_element_by_tag_name('svg')
    notes_before = get_number_of_notes(staff)

    for _ in range(8):
        add_random_note(staff, driver)

    notes_after = get_number_of_notes(staff)
    assert notes_after - notes_before == 7 # not eight, since we're replacing the first pause with the note


@pytest.mark.run(order=4)
@with_wait
def test_adding_and_removing_voices(driver, wait):
    assert get_number_of_voices(driver) == 2

    driver.find_element_by_name('addVoice').click()

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


@pytest.mark.run(order=5)
def test_changing_note_pitch(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')
    keys = [Keys.PAGE_UP, Keys.PAGE_DOWN, Keys.ARROW_UP, Keys.ARROW_DOWN]
    for _ in range(5):
        before_notes = staff.find_elements_by_class_name('vf-note')
        before_positions = [tuple(note.location.values()) for note in before_notes]
        note = random.choice(before_notes)

        # sanity check
        assert before_notes == staff.find_elements_by_class_name('vf-note')

        # generating a random set of 6 keys to press; it's even to allow for the situation where the keys lead to the
        # same note it started with (eg. up a half-step, down a half-step)
        transposition = [random.choice(keys) for __ in range(6)]

        ActionChains(driver)\
            .move_to_element(note).click()\
            .send_keys(*transposition)\
            .perform()

        after_notes = staff.find_elements_by_class_name('vf-note')
        after_positions = [tuple(note.location.values()) for note in after_notes]

        # this checks if the positions should change (the second part) and then checks if they actually changed
        assert (sorted(after_positions) == sorted(before_positions)) != check_if_this_changes_the_pitch(transposition)


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