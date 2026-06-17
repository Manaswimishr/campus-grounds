#ifndef SERVER_H
#define SERVER_H

#ifdef _WIN32_WINNT
#undef _WIN32_WINNT
#endif
#define _WIN32_WINNT 0x0A00

#ifdef WINVER
#undef WINVER
#endif
#define WINVER 0x0A00

#include "libs/httplib.h"

void registerRoutes(httplib::Server& server);

#endif
