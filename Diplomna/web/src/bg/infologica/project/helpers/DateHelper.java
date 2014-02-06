package bg.infologica.project.helpers;

import bg.infologica.project.utils.DateUtils;

import java.util.Calendar;

/**
 * Клас за работа с дати.
 *
 * @author Кальо Катеров
 * @version 2012-10-20 Първа версия.
 */
public class DateHelper {

    private Calendar date = null;

    public DateHelper() {
        // do nothing
    }

    public DateHelper(String date) {
        set(date);
    }

    public DateHelper(Calendar date) {
        set(date);
    }

    public DateHelper(int year, int month, int day) {
        set(year, month, day);
    }

    public String format(String date_format) {
        return DateUtils.format(date, date_format);
    }

    public String format() {
        return DateUtils.format(date);
    }

    public int getYear(int null_year) {
        return date != null ? date.get(Calendar.YEAR) : null_year;
    }

    public int getYear() {
        return getYear(0);
    }

    public int getMonth(int null_month) {
        return date != null ? date.get(Calendar.MONTH) + 1 : null_month;
    }

    public int getMonth() {
        return getMonth(0);
    }

    public int getDay(int null_day) {
        return date != null ? date.get(Calendar.DAY_OF_MONTH) : null_day;
    }

    public int getDay() {
        return getDay(0);
    }

    public long getLong(long null_value) {
        return date != null ? 10000L * getYear() + 100 * getMonth() + getDay() : null_value;
    }

    public long getLong() {
        return getLong(0);
    }

    public Calendar getDate() {
        return date;
    }

    public void set(String date) {
        this.date = DateUtils.parse(date);
    }

    public void set(Calendar date) {
        this.date = date;
    }

    public void set(int year, int month, int day) {
        this.date = Calendar.getInstance();
        this.date.set(year, month - 1, day);
    }

    public void setDate(Calendar date) {
        this.date = date;
    }

    public void setToday() {
        date = Calendar.getInstance();
    }

    public String toString() {
        return format();
    }

    public boolean valid() {
        return date != null;
    }
}
