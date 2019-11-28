import pytest
import random

from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from .utils import (
    with_wait,
    get_number_of_notes,
    get_number_of_voices,
    open_scores_modal,
    add_random_note,
    check_if_this_changes_the_pitch,
    log,
    choose_from_dropdown
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


@pytest.mark.run(order=4)
def test_adding_eightnotes(driver):
    staff = driver.find_element_by_tag_name('svg')
    notes_before = get_number_of_notes(staff)

    for _ in range(8):
        add_random_note(staff, driver)

    notes_after = get_number_of_notes(staff)
    assert notes_after - notes_before == 7  # not eight, since we're replacing the first pause with the note


@pytest.mark.run(order=3)
@with_wait
def test_adding_and_removing_voices(driver, wait):
    assert get_number_of_voices(driver) == 2

    driver.find_element_by_name('addVoice').click()

    assert get_number_of_voices(driver) == 3

    staff = driver.find_element_by_css_selector('#stave0 svg')
    choose_from_dropdown(driver, '#voices .select-wrapper', 2)
    add_random_note(staff, driver)

    driver.find_element_by_name('removeVoice').click()

    wait.until(
        EC.text_to_be_present_in_element((By.CLASS_NAME, 'info-box'), 'Voice is not empty.')
    )

    driver.find_element_by_name('removeNote').click()
    driver.find_element_by_name('removeVoice').click()

    assert get_number_of_voices(driver) == 2

    driver.find_element_by_name('removeVoice').click()
    driver.find_element_by_name('removeVoice').click()
    wait.until(
        EC.text_to_be_present_in_element((By.CLASS_NAME, 'info-box'), 'Minimum one voice required.')
    )

    for _ in range(4):
        driver.find_element_by_name('addVoice').click()

    wait.until(
        EC.text_to_be_present_in_element((By.CLASS_NAME, 'info-box'), 'Maximum of four voices reached.')
    )
    driver.find_element_by_name('removeVoice').click()
    driver.find_element_by_name('removeVoice').click()


@pytest.mark.run(order=5)
def test_changing_note_pitch(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')
    keys = [Keys.PAGE_UP, Keys.PAGE_DOWN, Keys.ARROW_UP, Keys.ARROW_DOWN]
    driver.execute_script('window.scrollTo(0, 0);')
    for _ in range(5):
        before_notes = staff.find_elements_by_class_name('vf-note')[:8]
        before_positions = [tuple(note.location.values()) for note in before_notes]
        note = random.choice(before_notes)

        # sanity check
        assert before_notes == staff.find_elements_by_class_name('vf-note')[:8]

        # generating a random set of 6 keys to press; it's even to allow for the situation where the keys lead to the
        # same note it started with (eg. up a half-step, down a half-step)
        transposition = [random.choice(keys) for __ in range(6)]

        ActionChains(driver)\
            .move_to_element(note).click()\
            .send_keys(*transposition)\
            .perform()

        after_notes = staff.find_elements_by_class_name('vf-note')[:8]
        after_positions = [tuple(note.location.values()) for note in after_notes]

        # TODO find what's causing this test to fail once in a while; specifically the statement False != False
        log(f"{transposition} > {check_if_this_changes_the_pitch(transposition)}"
            f" > {sorted(after_positions) == sorted(before_positions)}")
        assert (after_positions == before_positions) != check_if_this_changes_the_pitch(transposition)


@pytest.mark.run(order=6)
def test_changing_clef(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')
    before_positions = [tuple(note.location.values()) for note in staff.find_elements_by_class_name('vf-note')]


    which = random.randrange(1, 11)
    if which == 4: which += 1  # percussion clef doesnt change anything
    choose_from_dropdown(driver, 'div[name="clef"]', which)

    after_positions = [tuple(note.location.values()) for note in staff.find_elements_by_class_name('vf-note')]

    assert sorted(after_positions) != sorted(before_positions)


@pytest.mark.run(order=7)
def test_changing_key(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')
    before_positions = [tuple(note.location.values()) for note in staff.find_elements_by_class_name('vf-note')]

    which = random.randrange(1, 8) * -1 if random.random() > 0.5 else 1
    choose_from_dropdown(driver, 'div[name="keySig"]', 7 + which)

    after_positions = [tuple(note.location.values()) for note in staff.find_elements_by_class_name('vf-note')]

    assert sorted(after_positions) != sorted(before_positions)


@pytest.mark.run(order=8)
def test_changing_time_signature(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')
    before = get_number_of_notes(staff)

    choose_from_dropdown(driver, 'div[name="beatsType"]', random.choice([0, 2, 3, 4]))

    after = get_number_of_notes(staff)

    assert before != after

    choose_from_dropdown(driver, 'div[name="beatsType"]', 1)


@pytest.mark.run(order=10)
def test_adding_random_notes(driver):
    staff = driver.find_element_by_tag_name('svg')
    before = get_number_of_notes(staff)

    add_random = driver.find_element_by_name('addRandomNote')
    for _ in range(5):
        add_random.click()

    after = get_number_of_notes(staff)

    assert before < after


@pytest.mark.run(order=9)
def test_clearing_the_score(driver):
    staff = driver.find_element_by_tag_name('svg')

    driver.find_element_by_name('clearVoices').click()

    assert get_number_of_notes(staff) == 2


@pytest.mark.run(order=11)
def test_adding_notes_with_specific_duration(driver):
    driver.find_element_by_name('clearVoices').click()
    staff = driver.find_element_by_css_selector('#stave0 svg')
    before = get_number_of_notes(staff)

    for _ in range(10):
        # we dont want wholenotes tbh, hence [1:]
        duration = random.choice(driver.find_elements_by_css_selector('input[name="duration"] ~ span')[1:])
        duration.click()
        dotted, rest = driver.find_elements_by_css_selector('#note-duration input[type="checkbox"] ~ span')[1:]
        is_dotted = random.random() > 0.75
        is_rest = random.random() > 0.9
        if is_dotted:
            dotted.click()
        if is_rest:
            rest.click()
        add_random_note(staff, driver)
        if is_dotted:
            dotted.click()
        if is_rest:
            rest.click()
        ActionChains(driver).send_keys(Keys.TAB).perform()

    after = get_number_of_notes(staff)
    assert before < after


@pytest.mark.run(order=12)
def test_removing_notes(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')
    before_positions = [tuple(note.location.values()) for note in staff.find_elements_by_class_name('vf-note')]

    voice_select = driver.find_element_by_css_selector('#voices .select-wrapper')
    ActionChains(driver)\
        .move_to_element(voice_select).click()\
        .move_to_element(voice_select.find_element_by_css_selector('li:nth-of-type(1)')).click()\
        .perform()

    # test deleting last note
    driver.find_element_by_name('removeNote').click()

    after_positions = [tuple(note.location.values()) for note in staff.find_elements_by_class_name('vf-note')]

    assert before_positions != after_positions

    # test deleting a selected note by hand
    note_before = staff.find_element_by_class_name('vf-note')
    ActionChains(driver)\
        .move_to_element(note_before)\
        .click()\
        .send_keys(Keys.DELETE)\
        .perform()
    note_after = staff.find_element_by_class_name('vf-note')

    assert note_before != note_after


@pytest.mark.run(order=13)
def test_adding_measures(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')
    barlines_before = len(staff.find_elements_by_tag_name('rect'))

    measures_to_add = random.randint(2, 6)
    add_measure = driver.find_element_by_name('addMeasure')
    for _ in range(measures_to_add):
        add_measure.click()

    barlines_after = len(staff.find_elements_by_tag_name('rect'))

    assert barlines_after - barlines_before == measures_to_add * 2


@pytest.mark.run(order=14)
def test_removing_measures(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')

    def infobox_located():
        try:
            driver.find_element_by_class_name('info-box')
            return True
        except NoSuchElementException:
            return False

    remove_measure = driver.find_element_by_name('removeMeasure')
    while not infobox_located():
        remove_measure.click()

    assert driver.find_element_by_class_name('info-box').text.startswith('At least one measure required.')

    assert len(staff.find_elements_by_tag_name('rect')) == 3


@pytest.mark.run(order=15)
def test_editing_a_note(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')
    mode_switch = driver.find_element_by_css_selector('#note-duration .switch label')
    driver.find_element_by_name('clearVoices').click()
    mode_switch.click()

    assert any(info_box.text.startswith('Select a note to edit first.')\
               for info_box in driver.find_elements_by_class_name('info-box'))

    add_random_note(staff, driver)
    notes_before = len(staff.find_elements_by_css_selector('g.vf-note'))
    mode_switch.click()
    add_random_note(staff, driver)
    notes_after = len(staff.find_elements_by_css_selector('g.vf-note'))

    assert notes_before == notes_after, "Edit mode should disable adding new notes"

    dotted, rest = driver.find_elements_by_css_selector('#note-duration input[type="checkbox"] ~ span')[1:]
    note_before = staff.find_element_by_css_selector('g.vf-note')
    rest.click()
    note_after = staff.find_element_by_css_selector('g.vf-note')

    assert note_before != note_after, "Making a rest didn't work."

    note_before = note_after
    rest.click()
    note_after = staff.find_element_by_css_selector('g.vf-note')

    assert note_before != note_after, "Making not a rest didn't work."

    note_before = note_after
    dotted.click()
    note_after = staff.find_element_by_css_selector('g.vf-note')

    assert note_before != note_after, "Making a dotted note didn't work."

    note_before = note_after
    dotted.click()
    note_after = staff.find_element_by_css_selector('g.vf-note')

    assert note_before != note_after, "Making not a dotted note didn't work."

    for _ in range(5):
        note_before = note_after
        duration = random.choice(driver.find_elements_by_css_selector('input[name="duration"]:not(:checked) ~ span'))
        duration.click()
        note_after = staff.find_element_by_css_selector('g.vf-note')

        assert note_before != note_after, "Changing a note's duration didn't work."

    mode_switch.click()


@pytest.mark.run(order=16)
def test_adding_notes_in_remote_keys(driver):
    staff = driver.find_element_by_css_selector('#stave0 svg')
    driver.find_element_by_name('clearVoices').click()

    # making sure it only adds a simple eightnote
    driver.find_elements_by_css_selector('input[name="duration"] ~ span')[3].click()
    checkboxes = driver.find_elements_by_css_selector('#note-duration input[type="checkbox"]:checked ~ span')
    for checkbox in checkboxes:
        checkbox.click()
    # Cb major
    choose_from_dropdown(driver, 'div[name="keySig"]', 0)
    add_random_note(staff, driver)
    modifiers = staff.find_element_by_css_selector('g.vf-stavenote .vf-modifiers')

    assert modifiers.get_property('childElementCount') == 0

    # C major
    choose_from_dropdown(driver, 'div[name="keySig"]', 7)
    modifiers = staff.find_element_by_css_selector('g.vf-stavenote .vf-modifiers')

    assert modifiers.get_property('childElementCount') == 1

    # C# major
    driver.find_element_by_name('removeNote').click()
    choose_from_dropdown(driver, 'div[name="keySig"]', 7)
    add_random_note(staff, driver)
    modifiers = staff.find_element_by_css_selector('g.vf-stavenote .vf-modifiers')

    assert modifiers.get_property('childElementCount') == 0


@pytest.mark.run(order=17)
def test_generating_random_melody(driver):
    driver.find_element_by_name('clearVoices').click()
    staff = driver.find_element_by_css_selector('#stave0 svg')
    before = len(staff.find_elements_by_css_selector('g.vf-note'))

    choose_from_dropdown(driver, 'div[name="shortNoteDropdown"]', random.randrange(6, 13))
    choose_from_dropdown(driver, 'div[name="longNoteDropdown"]', random.randrange(0, 7))
    choose_from_dropdown(driver, 'div[name="intervalDropdown"]', random.randrange(0, 11))

    if random.random() > 0.5:
        ActionChains(driver).move_to_element(driver.find_element_by_name('allowRests')).click().perform()
    if random.random() > 0.5:
        ActionChains(driver).move_to_element(driver.find_element_by_name('diatonic')).click().perform()

    driver.find_element_by_name('generate').click()
    staff = driver.find_element_by_css_selector('#stave0 svg')
    after = len(staff.find_elements_by_css_selector('g.vf-note'))

    assert before < after


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
