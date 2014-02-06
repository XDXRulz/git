package bg.infologica.project.core;

import javax.servlet.*;
import java.io.IOException;

/**
 * Филтър, който задава кодиране UTF-8 на заявката и отговора.
 *
 * @author <a href="mailto:zhivko.zheliazkov@info-logica.com">Живко Желязков</a>
 * @version 2011-05-18 Първа версия.
 */
public final class FilterEncoding implements Filter {

    public void init(FilterConfig config) throws ServletException {
        // do nothing
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        request.setCharacterEncoding("UTF-8");
        chain.doFilter(request, response);
    }

    public void destroy() {
        //do nothing
    }

}
